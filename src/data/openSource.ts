import starCounts from '@/data/starCounts.json'

export type OssRole = 'author' | 'contributor'

/**
 * 'merged' — landed in the upstream repo.
 * 'open'   — proposed but not accepted. Anyone can click through and see this,
 *            so it must never be rendered as though it shipped.
 */
export type ContributionStatus = 'merged' | 'open'

export type Contribution = {
  ref: string
  url: string
  titleKey: string
  status: ContributionStatus
}

export type OssProject = {
  slug: string
  name: string
  repo: string
  url: string
  role: OssRole
  language?: string
  npm?: string
  blurbKey: string
  featured?: boolean
  contributions?: Contribution[]
}

export const OSS_PROJECTS: OssProject[] = [
  {
    slug: 'pane',
    name: 'Pane',
    repo: 'dcouple/Pane',
    url: 'https://github.com/dcouple/Pane',
    role: 'contributor',
    language: 'TypeScript',
    blurbKey: 'oss.projects.pane.blurb',
    featured: true,
    contributions: [
      {
        ref: 'PR #320',
        url: 'https://github.com/dcouple/Pane/pull/320',
        titleKey: 'oss.projects.pane.pr320',
        status: 'merged'
      },
      {
        ref: 'PR #301',
        url: 'https://github.com/dcouple/Pane/pull/301',
        titleKey: 'oss.projects.pane.pr301',
        status: 'merged'
      }
    ]
  },
  {
    slug: 'journey',
    name: 'journey',
    repo: 'rxova/journey',
    url: 'https://github.com/rxova/journey',
    role: 'author',
    language: 'TypeScript',
    blurbKey: 'oss.projects.journey.blurb',
    featured: true
  },
  {
    slug: 'use-everywhere',
    name: 'use-everywhere',
    repo: 'rxova/use-everywhere',
    url: 'https://github.com/rxova/use-everywhere',
    role: 'author',
    language: 'TypeScript',
    npm: 'https://www.npmjs.com/package/use-everywhere',
    blurbKey: 'oss.projects.useEverywhere.blurb',
    featured: true
  },
  {
    slug: 'typedash',
    name: 'typedash',
    repo: 'bengry/typedash',
    url: 'https://github.com/bengry/typedash',
    role: 'contributor',
    language: 'TypeScript',
    blurbKey: 'oss.projects.typedash.blurb',
    contributions: [
      {
        ref: 'PR #174',
        url: 'https://github.com/bengry/typedash/pull/174',
        titleKey: 'oss.projects.typedash.pr174',
        status: 'merged'
      }
    ]
  },
  {
    slug: 'immer',
    name: 'immer',
    repo: 'immerjs/immer',
    url: 'https://github.com/immerjs/immer',
    role: 'contributor',
    language: 'TypeScript',
    blurbKey: 'oss.projects.immer.blurb',
    contributions: [
      {
        ref: 'PR #1269',
        url: 'https://github.com/immerjs/immer/pull/1269',
        titleKey: 'oss.projects.immer.pr1269',
        status: 'open'
      },
      {
        ref: 'Issue #1268',
        url: 'https://github.com/immerjs/immer/issues/1268',
        titleKey: 'oss.projects.immer.issue1268',
        status: 'open'
      }
    ]
  }
]

const STARS: Record<string, number> = starCounts

/** Star count for a repo, refreshed by `pnpm update-oss`. Undefined if unknown. */
export const starsFor = (repo: string): number | undefined => STARS[repo]

export const authored = (projects = OSS_PROJECTS): OssProject[] =>
  projects.filter((p) => p.role === 'author')

export const contributed = (projects = OSS_PROJECTS): OssProject[] =>
  projects.filter((p) => p.role === 'contributor')

export const featured = (projects = OSS_PROJECTS): OssProject[] =>
  projects.filter((p) => p.featured)
