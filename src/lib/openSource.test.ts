import { describe, expect, it } from 'vitest'
import { OSS_PROJECTS, RXOVA_ORG } from '@/data/openSource'
import {
  authored,
  byOrg,
  contributed,
  featured,
  publishedPackages,
  starsFor
} from '@/lib/openSource'

describe('OSS_PROJECTS', () => {
  it('has no duplicate slugs', () => {
    const slugs = OSS_PROJECTS.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('points every project and contribution at a GitHub URL', () => {
    for (const project of OSS_PROJECTS) {
      expect(project.url).toMatch(/^https:\/\/github\.com\//)
      for (const contribution of project.contributions ?? []) {
        expect(contribution.url).toMatch(/^https:\/\/github\.com\//)
      }
    }
  })

  it('splits cleanly into authored and contributed', () => {
    expect(authored().length + contributed().length).toBe(OSS_PROJECTS.length)
  })

  it('credits the rxova org projects as authored', () => {
    expect(
      authored()
        .map((p) => p.slug)
        .sort()
    ).toEqual(['journey', 'react-inputs', 'use-everywhere'])
  })

  it('marks the immer work as open, never as merged', () => {
    const immer = OSS_PROJECTS.find((p) => p.slug === 'immer')
    expect(immer).toBeDefined()
    expect(immer?.contributions?.length).toBeGreaterThan(0)
    for (const contribution of immer?.contributions ?? []) {
      expect(contribution.status).toBe('open')
    }
  })

  it('marks the Pane and typedash contributions as merged', () => {
    for (const slug of ['pane', 'typedash']) {
      const project = OSS_PROJECTS.find((p) => p.slug === slug)
      for (const contribution of project?.contributions ?? []) {
        expect(contribution.status).toBe('merged')
      }
    }
  })

  it('features exactly the authored monorepos shown on the home page', () => {
    expect(
      featured()
        .map((p) => p.slug)
        .sort()
    ).toEqual(['journey', 'react-inputs', 'use-everywhere'])
  })

  // The section shipped for months without react-inputs even existing on it.
  it('lists react-inputs, the third rxova monorepo', () => {
    const project = OSS_PROJECTS.find((p) => p.slug === 'react-inputs')
    expect(project?.repo).toBe('rxova/react-inputs')
    expect(project?.role).toBe('author')
    expect(project?.packages?.map((pkg) => pkg.name)).toEqual([
      '@rxova/react-inputs',
      '@rxova/react-intl-currency-input',
      '@rxova/react-otp-input',
      '@rxova/react-rating-input',
      '@rxova/codemod'
    ])
  })

  it('points every listed package at npm', () => {
    for (const pkg of publishedPackages()) {
      expect(pkg.url).toBe(`https://www.npmjs.com/package/${pkg.name}`)
    }
  })
})

describe('byOrg', () => {
  it('collects the rxova monorepos, and only those', () => {
    expect(byOrg(RXOVA_ORG.id).map((p) => p.slug)).toEqual([
      'journey',
      'react-inputs',
      'use-everywhere'
    ])
  })

  // Someone else's repo carries no org badge, however much I contributed to it.
  it('leaves the contributed repos unbranded', () => {
    for (const project of contributed()) {
      expect(project.org).toBeUndefined()
    }
  })

  it('is empty for an org that ships nothing here', () => {
    expect(byOrg('not-an-org')).toEqual([])
  })
})

describe('starsFor', () => {
  it('resolves a known repo', () => {
    expect(starsFor('dcouple/Pane')).toBeGreaterThan(0)
  })

  it('returns undefined for an unknown repo rather than throwing', () => {
    expect(starsFor('nobody/nothing')).toBeUndefined()
  })
})
