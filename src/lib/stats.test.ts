import { describe, expect, it } from 'vitest'
import credly from '@/dataFetchers/credly.backup.json'
import mediumData from '@/dataFetchers/mediumData.json'
import { OSS_PROJECTS } from '@/data/openSource'
import { dedupeBadges } from '@/lib/certifications'
import { getStats, yearsOfExperience } from '@/lib/stats'
import type { CredlyBadge } from '@/types/credly.types'

describe('getStats', () => {
  it('derives the certification count from the deduped data, not a literal', () => {
    expect(getStats().certifications).toBe(
      dedupeBadges(credly.data as CredlyBadge[]).length
    )
  })

  it('reports 33 certifications, not the 36 the old site claimed', () => {
    expect(getStats().certifications).toBe(33)
  })

  it('derives the article count from the data, not the old "24+" claim', () => {
    expect(getStats().articles).toBe(mediumData.length)
    expect(getStats().articles).toBe(10)
  })

  it('derives the open-source project count', () => {
    expect(getStats().openSourceProjects).toBe(OSS_PROJECTS.length)
  })
})

describe('yearsOfExperience', () => {
  const start = new Date(2019, 3, 1)

  it('counts a full year on the anniversary', () => {
    expect(yearsOfExperience(new Date(2020, 3, 1), start)).toBe(1)
  })

  it('does not count the year before the anniversary lands', () => {
    expect(yearsOfExperience(new Date(2020, 2, 31), start)).toBe(0)
  })

  it('never returns a negative number', () => {
    expect(yearsOfExperience(new Date(2018, 0, 1), start)).toBe(0)
  })

  it('handles a date years later', () => {
    expect(yearsOfExperience(new Date(2026, 6, 12), start)).toBe(7)
  })
})
