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
  tList: (key: string) => string[]
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
      let value: unknown = translations[language]

      for (const k of keys) {
        if (
          value &&
          typeof value === 'object' &&
          k in value &&
          value !== null
        ) {
          value = (value as Record<string, unknown>)[k]
        } else {
          // Fallback to English if key not found
          let fallback: unknown = translations.en
          for (const fk of keys) {
            if (
              fallback &&
              typeof fallback === 'object' &&
              fk in fallback &&
              fallback !== null
            ) {
              fallback = (fallback as Record<string, unknown>)[fk]
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

  // t() flattens everything to a string. Some copy is a list (the rotating hero
  // phrases), so it needs its own accessor rather than a stringified array.
  const tList = useCallback(
    (key: string): string[] => {
      const lookup = (dict: unknown): unknown =>
        key.split('.').reduce<unknown>((value, k) => {
          if (value && typeof value === 'object' && k in value) {
            return (value as Record<string, unknown>)[k]
          }
          return undefined
        }, dict)

      const value = lookup(translations[language]) ?? lookup(translations.en)

      return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : []
    },
    [language]
  )

  const direction = getDirection(language)
  const rtl = isRTL(language)

  const value = useMemo(
    () => ({ language, setLanguage, t, tList, direction, isRTL: rtl }),
    [language, setLanguage, t, tList, direction, rtl]
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
