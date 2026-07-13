import { describe, expect, it } from 'vitest'
import { LOCALES } from '@/lib/locale'
import { buildMetadata } from '@/lib/metadata'
import { PAGE_META, type PageKey } from '@/lib/pageMeta'

describe('PAGE_META', () => {
  it('defines the same pages in every locale, each with title + description', () => {
    const pages = Object.keys(PAGE_META.en).sort()
    for (const locale of LOCALES) {
      expect(Object.keys(PAGE_META[locale]).sort()).toEqual(pages)
      for (const page of pages as PageKey[]) {
        expect(PAGE_META[locale][page].title.trim()).not.toBe('')
        expect(PAGE_META[locale][page].description.trim()).not.toBe('')
      }
    }
  })
})

describe('buildMetadata', () => {
  it('sets a locale-specific canonical and hreflang alternates for every locale', () => {
    const meta = buildMetadata('es', 'blog')
    expect(meta.alternates?.canonical).toBe('/es/blog')
    expect(meta.alternates?.languages).toMatchObject({
      en: '/en/blog',
      es: '/es/blog',
      he: '/he/blog',
      'x-default': '/en/blog'
    })
  })

  it('uses the absolute title for home and the suffixed title elsewhere', () => {
    expect(buildMetadata('en', 'home').title).toContain('Software Engineer')
    expect(buildMetadata('en', 'blog').title).toBe(
      'Blog Posts — Jonatan Kruszewski'
    )
  })

  it('localizes the description', () => {
    expect(buildMetadata('es', 'contact').description).toMatch(/llamada/i)
  })
})
