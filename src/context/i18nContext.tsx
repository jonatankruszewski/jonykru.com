'use client'

import React, { createContext, useContext, useMemo } from 'react'
import { interpolate } from '@/lib/i18n'
import {
  directionOf,
  isRTLLocale,
  localePath as buildLocalePath,
  type Locale
} from '@/lib/locale'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import he from '@/locales/he.json'

/** Kept as an alias so existing imports (`Language`) still resolve. */
export type Language = Locale
export type Direction = 'ltr' | 'rtl'

const translations = { en, es, he }

interface I18nContextType {
  language: Locale
  t: (key: string, params?: Record<string, string | number>) => string
  tList: (key: string) => string[]
  direction: Direction
  isRTL: boolean
  /** Prefixes an internal path with the active locale (external URLs pass through). */
  localePath: (path: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

/**
 * The locale now comes from the route (`/[lang]/…`), not from localStorage, so
 * every page is server-rendered in its language with the correct `<html lang>`.
 * Switching languages is navigation (see LanguageSwitcher), not client state.
 */
export function I18nProvider({
  locale,
  children
}: {
  locale: Locale
  children: React.ReactNode
}) {
  const value = useMemo<I18nContextType>(() => {
    const resolve = (key: string): unknown => {
      const fromLocale = key
        .split('.')
        .reduce<unknown>(
          (node, k) =>
            node && typeof node === 'object' && k in node
              ? (node as Record<string, unknown>)[k]
              : undefined,
          translations[locale]
        )
      if (fromLocale !== undefined) return fromLocale
      // Fall back to English for any key missing in a translation.
      return key
        .split('.')
        .reduce<unknown>(
          (node, k) =>
            node && typeof node === 'object' && k in node
              ? (node as Record<string, unknown>)[k]
              : undefined,
          translations.en
        )
    }

    return {
      language: locale,
      direction: directionOf(locale),
      isRTL: isRTLLocale(locale),
      localePath: (path: string) => buildLocalePath(locale, path),
      t: (key, params) => {
        const value = resolve(key)
        return typeof value === 'string' ? interpolate(value, params) : key
      },
      tList: (key) => {
        const value = resolve(key)
        return Array.isArray(value)
          ? value.filter((item): item is string => typeof item === 'string')
          : []
      }
    }
  }, [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
