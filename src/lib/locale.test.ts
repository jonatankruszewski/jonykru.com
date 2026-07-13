import { describe, expect, it } from 'vitest'
import { directionOf, isLocale, localePath, stripLocale } from '@/lib/locale'

describe('isLocale', () => {
  it('accepts the known locales and rejects others', () => {
    expect(isLocale('en')).toBe(true)
    expect(isLocale('he')).toBe(true)
    expect(isLocale('fr')).toBe(false)
  })
})

describe('directionOf', () => {
  it('marks Hebrew rtl, everything else ltr', () => {
    expect(directionOf('he')).toBe('rtl')
    expect(directionOf('en')).toBe('ltr')
    expect(directionOf('es')).toBe('ltr')
  })
})

describe('stripLocale', () => {
  it('removes a leading locale segment', () => {
    expect(stripLocale('/es/blog')).toBe('/blog')
    expect(stripLocale('/en')).toBe('/')
    expect(stripLocale('/he/open-source/')).toBe('/open-source')
  })

  it('leaves an unprefixed path alone', () => {
    expect(stripLocale('/blog')).toBe('/blog')
    expect(stripLocale('/')).toBe('/')
  })
})

describe('localePath', () => {
  it('prefixes a bare path with the locale', () => {
    expect(localePath('es', '/blog')).toBe('/es/blog')
    expect(localePath('en', '/')).toBe('/en')
  })

  it('swaps an existing locale (so it doubles as a language switch)', () => {
    expect(localePath('en', '/es/blog')).toBe('/en/blog')
    expect(localePath('he', '/en')).toBe('/he')
  })

  it('passes external URLs and in-page anchors through untouched', () => {
    expect(localePath('es', 'https://github.com/x')).toBe(
      'https://github.com/x'
    )
    expect(localePath('es', 'mailto:a@b.com')).toBe('mailto:a@b.com')
    expect(localePath('es', '#content')).toBe('#content')
  })
})
