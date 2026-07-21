import { describe, expect, it } from 'vitest'
import credly from '@/dataFetchers/credly.backup.json'
import mediumData from '@/dataFetchers/mediumData.json'
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

  it('derives the article count from the data', () => {
    // The old site claimed "24+" with only 10 articles in the file, because
    // Medium's RSS caps at 10. The Medium export filled in the other 14, so the
    // number is now 25 *and* every one of them is a real, linkable article.
    expect(getStats().articles).toBe(mediumData.length)
    expect(getStats().articles).toBe(25)
  })

  it('counts the two authored rxova projects', () => {
    expect(getStats().authoredProjects).toBe(2)
  })

  it('counts five published packages, excluding the private tooling one', () => {
    expect(getStats().publishedPackages).toBe(5)
  })

  it('counts the repos contributed to', () => {
    expect(getStats().contributedRepos).toBe(4)
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
