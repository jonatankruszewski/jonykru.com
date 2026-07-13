import { describe, expect, it } from 'vitest'
import credly from '@/dataFetchers/credly.backup.json'
import mediumData from '@/dataFetchers/mediumData.json'
import {
  assertValid,
  isCredlyBadge,
  isMediumArticle
} from '@/lib/dataValidation'

describe('isCredlyBadge', () => {
  it('accepts a well-formed badge', () => {
    expect(isCredlyBadge(credly.data[0])).toBe(true)
  })

  it('rejects a badge whose template is missing a name', () => {
    expect(
      isCredlyBadge({
        id: 'x',
        image_url: 'https://img',
        issuer_linked_in_name: 'AWS',
        badge_template: { url: 'https://cred' }
      })
    ).toBe(false)
  })

  it('rejects non-objects', () => {
    expect(isCredlyBadge(null)).toBe(false)
    expect(isCredlyBadge('nope')).toBe(false)
  })
})

describe('isMediumArticle', () => {
  it('accepts a well-formed article', () => {
    expect(isMediumArticle(mediumData[0])).toBe(true)
  })

  it('rejects an article without a categories array', () => {
    expect(
      isMediumArticle({ title: 't', guid: 'g', link: 'l', pubDate: 'p' })
    ).toBe(false)
  })
})

describe('assertValid', () => {
  it('throws naming the first offending index', () => {
    const rows = [
      { title: 't', guid: 'g', link: 'l', pubDate: 'p', categories: [] },
      {}
    ]
    expect(() => assertValid(rows, isMediumArticle, 'medium')).toThrow(
      /medium: malformed record at index 1/
    )
  })
})

// The point of the guards: catch a bad refresh before it ships. Run them over
// the actual committed datasets so a shape regression fails here, in CI.
describe('committed datasets', () => {
  it('every Credly badge in the backup is valid', () => {
    expect(() =>
      assertValid(credly.data, isCredlyBadge, 'credly')
    ).not.toThrow()
  })

  it('every Medium article in the feed is valid', () => {
    expect(() =>
      assertValid(mediumData, isMediumArticle, 'medium')
    ).not.toThrow()
  })
})
