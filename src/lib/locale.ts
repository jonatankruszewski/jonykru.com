export const LOCALES = ['en', 'es', 'he'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

const RTL_LOCALES = new Set<Locale>(['he'])

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value)

export const directionOf = (locale: Locale): 'ltr' | 'rtl' =>
  RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'

export const isRTLLocale = (locale: Locale): boolean => RTL_LOCALES.has(locale)

const isExternal = (path: string): boolean =>
  /^([a-z]+:)?\/\//i.test(path) ||
  path.startsWith('mailto:') ||
  path.startsWith('#')

/** A path with any leading locale segment removed: /es/blog → /blog, /en → /. */
export const stripLocale = (path: string): string => {
  const segments = path.replace(/^\//, '').replace(/\/$/, '').split('/')
  if (segments[0] && isLocale(segments[0])) {
    const rest = segments.slice(1).join('/')
    return rest === '' ? '/' : `/${rest}`
  }
  return path === '' ? '/' : path
}

/**
 * Prefixes an app-internal path with `locale`, swapping any locale already
 * present (so it doubles as "switch this URL to another language"). External
 * URLs and in-page anchors pass through untouched, so it's safe on any href.
 */
export const localePath = (locale: Locale, path: string): string => {
  if (isExternal(path)) return path
  const base = stripLocale(path)
  const clean = base === '/' ? '' : base.replace(/\/$/, '')
  return `/${locale}${clean}`
}
