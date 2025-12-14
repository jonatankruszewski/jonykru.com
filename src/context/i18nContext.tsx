'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

export type Language = 'en' | 'es'

const translations = { en, es }

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.slice(0, 2)
      if (browserLang === 'es') {
        setLanguageState('es')
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (mounted) {
      localStorage.setItem('language', lang)
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        // Fallback to English if key not found
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let fallback: any = translations.en
        for (const fk of keys) {
          if (fallback && typeof fallback === 'object' && fk in fallback) {
            fallback = fallback[fk]
          } else {
            return key // Return key if not found in fallback either
          }
        }
        return typeof fallback === 'string' ? fallback : key
      }
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
