import { describe, expect, it } from 'vitest'
import credly from '@/dataFetchers/credly.backup.json'
import {
  aiBadges,
  dedupeBadges,
  filterByIssuer,
  groupByIssuer,
  issuersOf
} from '@/lib/certifications'
import type { CredlyBadge } from '@/types/credly.types'

const badges = credly.data as CredlyBadge[]

const badge = (name: string, issuer: string): CredlyBadge =>
  ({
    id: name,
    badge_template: { name, skills: [], url: '' },
    image_url: '',
    issuer_linked_in_name: issuer,
    issuer: { entities: [] }
  }) as CredlyBadge

describe('dedupeBadges', () => {
  it('collapses the duplicated AWS Cloud Practitioner in the real data', () => {
    expect(badges).toHaveLength(34)
    expect(dedupeBadges(badges)).toHaveLength(33)
  })

  it('keeps the first occurrence of a duplicate', () => {
    const list = [badge('A', 'AWS'), badge('A', 'AWS'), badge('B', 'Microsoft')]
    expect(dedupeBadges(list).map((b) => b.badge_template.name)).toEqual([
      'A',
      'B'
    ])
  })

  it('leaves a list with no duplicates untouched', () => {
    const list = [badge('A', 'AWS'), badge('B', 'AWS')]
    expect(dedupeBadges(list)).toHaveLength(2)
  })
})

describe('issuersOf', () => {
  it('returns unique issuers sorted alphabetically', () => {
    const list = [
      badge('A', 'Microsoft'),
      badge('B', 'AWS'),
      badge('C', 'Microsoft')
    ]
    expect(issuersOf(list)).toEqual(['AWS', 'Microsoft'])
  })
})

describe('groupByIssuer', () => {
  it('buckets badges under their issuer', () => {
    const grouped = groupByIssuer([
      badge('A', 'AWS'),
      badge('B', 'AWS'),
      badge('C', 'Microsoft')
    ])
    expect(grouped.AWS).toHaveLength(2)
    expect(grouped.Microsoft).toHaveLength(1)
  })

  it('covers every deduped badge in the real data', () => {
    const deduped = dedupeBadges(badges)
    const grouped = groupByIssuer(deduped)
    const total = Object.values(grouped).reduce((n, g) => n + g.length, 0)
    expect(total).toBe(deduped.length)
  })
})

describe('filterByIssuer', () => {
  it('returns everything when the issuer is null', () => {
    const list = [badge('A', 'AWS'), badge('B', 'Microsoft')]
    expect(filterByIssuer(list, null)).toHaveLength(2)
  })

  it('returns only the matching issuer', () => {
    const list = [badge('A', 'AWS'), badge('B', 'Microsoft')]
    expect(filterByIssuer(list, 'AWS')).toHaveLength(1)
  })

  it('returns nothing for an unknown issuer', () => {
    expect(filterByIssuer([badge('A', 'AWS')], 'Nope')).toHaveLength(0)
  })
})

describe('aiBadges', () => {
  it('finds the AI-relevant badges that back the positioning', () => {
    const found = aiBadges(dedupeBadges(badges)).map(
      (b) => b.badge_template.name
    )
    expect(found.length).toBeGreaterThanOrEqual(2)
    expect(found.join(' ')).toContain('AI Practitioner')
  })

  it('skips badges that are not present rather than emitting undefined', () => {
    expect(aiBadges([badge('Unrelated', 'AWS')])).toEqual([])
  })
})
