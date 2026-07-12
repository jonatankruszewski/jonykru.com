import { describe, expect, it } from 'vitest'
import mediumData from '@/dataFetchers/mediumData.json'
import { latest, sortByDateDesc } from '@/lib/publications'
import type { MediumFlatData } from '@/types/medium.types'

const articles = mediumData as MediumFlatData[]

const article = (title: string, pubDate: string): MediumFlatData => ({
  title,
  pubDate,
  guid: title,
  link: '',
  categories: [],
  image: ''
})

describe('sortByDateDesc', () => {
  it('puts the newest article first', () => {
    const sorted = sortByDateDesc([
      article('old', '2024-01-01'),
      article('new', '2024-12-01'),
      article('mid', '2024-06-01')
    ])
    expect(sorted.map((a) => a.title)).toEqual(['new', 'mid', 'old'])
  })

  it('does not mutate the input', () => {
    const input = [article('a', '2024-01-01'), article('b', '2024-12-01')]
    sortByDateDesc(input)
    expect(input.map((a) => a.title)).toEqual(['a', 'b'])
  })

  it('sorts the real archive without losing articles', () => {
    expect(sortByDateDesc(articles)).toHaveLength(articles.length)
    expect(articles.length).toBe(24)
  })

  it('returns the real archive newest-first', () => {
    const sorted = sortByDateDesc(articles)
    const dates = sorted.map((a) => new Date(a.pubDate).getTime())
    expect(dates).toEqual([...dates].sort((a, b) => b - a))
  })
})

describe('latest', () => {
  it('takes the n newest', () => {
    const top = latest(articles, 3)
    expect(top).toHaveLength(3)
    expect(new Date(top[0].pubDate).getTime()).toBeGreaterThanOrEqual(
      new Date(top[1].pubDate).getTime()
    )
  })

  it('returns everything when asked for more than exist', () => {
    expect(latest(articles, 100)).toHaveLength(articles.length)
  })
})
