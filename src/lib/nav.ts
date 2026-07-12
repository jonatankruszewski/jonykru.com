export type Route = {
  href: string
  labelKey: string
  /** Included in the sitemap. */
  indexable: boolean
  priority: number
}

/**
 * Single source of truth for routing. The nav and the sitemap both read this,
 * so a new page cannot appear in one and be missing from the other.
 */
export const ROUTES: Route[] = [
  { href: '/', labelKey: 'nav.home', indexable: true, priority: 1 },
  {
    href: '/open-source',
    labelKey: 'nav.openSource',
    indexable: true,
    priority: 0.9
  },
  {
    href: '/writing',
    labelKey: 'nav.writing',
    indexable: true,
    priority: 0.8
  },
  {
    href: '/certifications',
    labelKey: 'nav.certifications',
    indexable: true,
    priority: 0.6
  },
  { href: '/contact', labelKey: 'nav.contact', indexable: true, priority: 0.7 }
]

/** Routes shown in the header. Home is the logo, so it isn't repeated. */
export const NAV_ROUTES = ROUTES.filter((route) => route.href !== '/')

const normalize = (pathname: string): string => {
  const trimmed = pathname.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

/**
 * `trailingSlash: true` means usePathname() reports "/writing/", while hrefs are
 * authored as "/writing" — compare both ends normalized or nothing ever matches.
 */
export const isActiveRoute = (pathname: string, href: string): boolean =>
  normalize(pathname) === normalize(href)
