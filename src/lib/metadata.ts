import type { Metadata } from 'next'
import { DEFAULT_LOCALE, type Locale, LOCALES } from '@/lib/locale'
import { PAGE_META, type PageKey, titleFor } from '@/lib/pageMeta'

const ROUTE_PATH: Record<PageKey, string> = {
  home: '',
  openSource: '/open-source',
  blog: '/blog',
  certifications: '/certifications',
  contact: '/contact'
}

const OG_IMAGE: Record<PageKey, string> = {
  home: '/og/home.png',
  openSource: '/og/open-source.png',
  blog: '/og/blog.png',
  certifications: '/og/certifications.png',
  contact: '/og/contact.png'
}

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
  he: 'he_IL'
}

/**
 * Per-locale, per-page metadata: localized title/description, a canonical at
 * `/[lang]/…`, and `hreflang` alternates for every locale (plus x-default → en).
 * This is what makes the es/he routes indexable as distinct pages.
 */
export const buildMetadata = (locale: Locale, page: PageKey): Metadata => {
  const path = ROUTE_PATH[page]
  const canonical = `/${locale}${path}`

  const languages: Record<string, string> = {}
  for (const l of LOCALES) languages[l] = `/${l}${path}`
  languages['x-default'] = `/${DEFAULT_LOCALE}${path}`

  return {
    title: titleFor(locale, page),
    description: PAGE_META[locale][page].description,
    alternates: { canonical, languages },
    openGraph: {
      url: canonical,
      images: [OG_IMAGE[page]],
      locale: OG_LOCALE[locale]
    },
    twitter: { card: 'summary_large_image', images: [OG_IMAGE[page]] }
  }
}
