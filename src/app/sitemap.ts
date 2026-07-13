import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/site'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/locale'
import { ROUTES } from '@/lib/nav'

export const dynamic = 'force-static'

// One entry per locale per route (each route is now /[lang]/…), with hreflang
// alternates so search engines connect the language variants. Generated from the
// same route table the nav reads, so a page can't ship in one and miss the other.
const urlFor = (lang: string, href: string): string =>
  `${SITE_URL}/${lang}${href === '/' ? '' : href}/`

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return ROUTES.filter((route) => route.indexable).flatMap((route) => {
    const languages = Object.fromEntries(
      LOCALES.map((lang) => [lang, urlFor(lang, route.href)])
    )

    return LOCALES.map((lang) => ({
      url: urlFor(lang, route.href),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: lang === DEFAULT_LOCALE ? route.priority : route.priority * 0.9,
      alternates: { languages }
    }))
  })
}
