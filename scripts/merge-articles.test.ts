import { describe, expect, it } from 'vitest'
import { mergeArticles } from './update-medium'
import type { MediumFlatData } from '../src/types/medium.types'

const article = (
  guid: string,
  pubDate: string,
  image = ''
): MediumFlatData => ({
  title: guid,
  pubDate,
  guid,
  link: `https://medium.com/${guid}`,
  categories: [],
  image
})

describe('mergeArticles', () => {
  it('keeps articles the feed no longer returns', () => {
    // Medium's RSS only returns the latest 10, so an overwrite would delete
    // every older post. This is the whole reason the archive was stuck at 10.
    const existing = [article('old', '2023-01-01')]
    const incoming = [article('new', '2024-01-01')]

    const merged = mergeArticles(existing, incoming)
    expect(merged.map((a) => a.guid)).toEqual(['new', 'old'])
  })

  it('does not duplicate an article already on disk', () => {
    const merged = mergeArticles(
      [article('a', '2024-01-01')],
      [article('a', '2024-01-01')]
    )
    expect(merged).toHaveLength(1)
  })

  it('sorts newest first', () => {
    const merged = mergeArticles(
      [article('mid', '2024-06-01')],
      [article('old', '2023-01-01'), article('new', '2025-01-01')]
    )
    expect(merged.map((a) => a.guid)).toEqual(['new', 'mid', 'old'])
  })

  it('lets fresh data win on conflict', () => {
    const stale = [{ ...article('a', '2024-01-01'), title: 'Old title' }]
    const fresh = [{ ...article('a', '2024-01-01'), title: 'New title' }]
    expect(mergeArticles(stale, fresh)[0].title).toBe('New title')
  })

  it('does not blank an existing local image when the refetch has none yet', () => {
    const existing = [article('a', '2024-01-01', '/images/medium/a.webp')]
    const incoming = [article('a', '2024-01-01', '')]
    expect(mergeArticles(existing, incoming)[0].image).toBe(
      '/images/medium/a.webp'
    )
  })

  it('takes a new image when the refetch provides one', () => {
    const existing = [article('a', '2024-01-01', '/images/medium/old.webp')]
    const incoming = [article('a', '2024-01-01', '/images/medium/new.webp')]
    expect(mergeArticles(existing, incoming)[0].image).toBe(
      '/images/medium/new.webp'
    )
  })

  it('handles an empty starting file', () => {
    expect(mergeArticles([], [article('a', '2024-01-01')])).toHaveLength(1)
  })
})
