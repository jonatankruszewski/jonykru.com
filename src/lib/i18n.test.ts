import { describe, expect, it } from 'vitest'
import { flattenKeys, interpolate, missingKeys } from '@/lib/i18n'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import he from '@/locales/he.json'

describe('flattenKeys', () => {
  it('flattens nested objects to dot paths', () => {
    expect(flattenKeys({ a: { b: 'x' }, c: 'y' })).toEqual(['a.b', 'c'])
  })
})

describe('interpolate', () => {
  it('substitutes tokens from params, coercing numbers to strings', () => {
    expect(
      interpolate('{total} exams, {scrum} from Scrum.org', {
        total: 33,
        scrum: 13
      })
    ).toBe('33 exams, 13 from Scrum.org')
  })

  it('leaves the template untouched when no params are given', () => {
    expect(interpolate('{total} exams')).toBe('{total} exams')
  })

  it('leaves unknown tokens in place', () => {
    expect(interpolate('{known} and {unknown}', { known: 'x' })).toBe(
      'x and {unknown}'
    )
  })
})

describe('translation completeness', () => {
  // A full-site copy rewrite silently breaks es/he unless something checks.
  // This is that something.
  it('has no keys missing from Spanish', () => {
    expect(missingKeys(en, es)).toEqual([])
  })

  it('has no keys missing from Hebrew', () => {
    expect(missingKeys(en, he)).toEqual([])
  })

  it('has no stale keys in Spanish that English dropped', () => {
    expect(missingKeys(es, en)).toEqual([])
  })

  it('has no stale keys in Hebrew that English dropped', () => {
    expect(missingKeys(he, en)).toEqual([])
  })

  it('reports the specific missing key rather than just failing', () => {
    expect(missingKeys({ a: { b: 1, c: 2 } }, { a: { b: 1 } })).toEqual(['a.c'])
  })

  it('leaves no empty strings in any locale', () => {
    const locales: [string, Record<string, unknown>][] = [
      ['en', en],
      ['es', es],
      ['he', he]
    ]

    for (const [name, dict] of locales) {
      const empties = Object.entries(dict).filter(
        ([, value]) => typeof value === 'string' && value.trim() === ''
      )
      expect(empties, `${name} has empty strings`).toEqual([])
    }
  })
})
