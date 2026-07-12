import { describe, expect, it } from 'vitest'
import {
  authored,
  contributed,
  featured,
  OSS_PROJECTS,
  starsFor
} from '@/data/openSource'

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
    ).toEqual(['journey', 'use-everywhere'])
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

  it('features exactly the three projects shown on the home page', () => {
    expect(featured()).toHaveLength(3)
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
