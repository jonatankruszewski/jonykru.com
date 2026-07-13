export const LOCALES = ['en', 'es', 'he'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

const RTL_LOCALES = new Set<Locale>(['he'])

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value)

export const directionOf = (locale: Locale): 'ltr' | 'rtl' =>
  RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'

export const isRTLLocale = (locale: Locale): boolean => RTL_LOCALES.has(locale)

/**
 * Prefixes an app-internal path with the active locale. External URLs (http…,
 * mailto…) and already-prefixed paths pass through untouched, so the same
 * helper is safe to call on any href.
 */
export const localePath = (locale: Locale, path: string): string => {
  if (/^([a-z]+:)?\/\//i.test(path) || path.startsWith('mailto:')) return path

  const clean = path === '/' ? '' : path.replace(/\/$/, '')
  const [firstSegment] = clean.replace(/^\//, '').split('/')
  if (isLocale(firstSegment)) return clean === '' ? `/${locale}` : clean

  return `/${locale}${clean}`
}
