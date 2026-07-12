import { describe, expect, it } from 'vitest'
import { mediumPostId, mergeArticles } from './update-medium'
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

  it('treats the RSS guid and the export canonical as the same article', () => {
    // The two sources spell the same post differently and only share the
    // trailing post id. Keying on the raw guid double-counted every article.
    const fromRss: MediumFlatData = {
      title: 'Why Zero Tech Debt is a Myth',
      pubDate: '2024-10-21T23:40:04.158Z',
      guid: 'https://medium.com/p/4a83ebc66e60',
      link: 'https://levelup.gitconnected.com/why-zero-tech-debt-4a83ebc66e60',
      categories: [],
      image: '/images/medium/4a83ebc66e60.webp'
    }
    const fromExport: MediumFlatData = {
      title: 'Why Zero Tech Debt is a Myth',
      pubDate: '2024-10-21T23:40:04.158Z',
      guid: 'https://medium.com/@jonakrusze/why-zero-tech-debt-4a83ebc66e60',
      link: 'https://medium.com/@jonakrusze/why-zero-tech-debt-4a83ebc66e60',
      categories: [],
      image: ''
    }

    const merged = mergeArticles([fromRss], [fromExport])
    expect(merged).toHaveLength(1)
    // and it keeps the downloaded image and the reader-facing publication link
    expect(merged[0].image).toBe('/images/medium/4a83ebc66e60.webp')
    expect(merged[0].link).toContain('levelup.gitconnected.com')
  })
})

describe('mediumPostId', () => {
  it('extracts the post id from an RSS guid', () => {
    expect(
      mediumPostId({
        ...article('x', '2024-01-01'),
        guid: 'https://medium.com/p/4a83ebc66e60'
      })
    ).toBe('4a83ebc66e60')
  })

  it('extracts the same id from a slugged publication URL', () => {
    expect(
      mediumPostId({
        ...article('x', '2024-01-01'),
        guid: 'https://medium.com/@jonakrusze/why-zero-tech-debt-4a83ebc66e60',
        link: 'https://levelup.gitconnected.com/why-zero-tech-debt-4a83ebc66e60'
      })
    ).toBe('4a83ebc66e60')
  })
})
