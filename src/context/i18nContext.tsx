'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import he from '@/locales/he.json'

export type Language = 'en' | 'es' | 'he'
export type Direction = 'ltr' | 'rtl'

interface LanguageConfig {
  isRTL?: boolean
}

const LANGUAGE_CONFIG: Record<Language, LanguageConfig> = {
  en: {},
  es: {},
  he: { isRTL: true }
}

const translations = { en, es, he }

export const getDirection = (lang: Language): Direction =>
  LANGUAGE_CONFIG[lang]?.isRTL ? 'rtl' : 'ltr'

export const isRTL = (lang: Language): boolean =>
  LANGUAGE_CONFIG[lang]?.isRTL ?? false

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  direction: Direction
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage synchronously (SSR-safe)
  const getInitialLanguage = (): Language => {
    if (typeof window === 'undefined') {
      return 'en'
    }

    try {
      const savedLanguage = localStorage.getItem('language') as Language | null
      if (savedLanguage && savedLanguage in LANGUAGE_CONFIG) {
        return savedLanguage
      }
    } catch {
      // localStorage not available
    }
    // Try to detect browser language
    const browserLang = navigator.language.slice(0, 2) as Language

    if (browserLang in LANGUAGE_CONFIG && browserLang !== 'en') {
      return browserLang
    }

    return 'en'
  }

  const [language, setLanguageState] = useState<Language>(getInitialLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang)
      if (mounted) {
        localStorage.setItem('language', lang)
      }
    },
    [mounted]
  )

  const t = useCallback(
    (key: string): string => {
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
    },
    [language]
  )

  const direction = getDirection(language)
  const rtl = isRTL(language)

  const value = useMemo(
    () => ({ language, setLanguage, t, direction, isRTL: rtl }),
    [language, setLanguage, t, direction, rtl]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
