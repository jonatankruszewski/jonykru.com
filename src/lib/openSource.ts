import { OSS_PROJECTS, RXOVA_ORG, STAR_COUNTS } from '@/data/openSource'
import type { OssPackage, OssProject } from '@/types/openSource.types'

/** Star count for a repo, refreshed by `pnpm update-oss`. Undefined if unknown. */
export const starsFor = (repo: string): number | undefined => STAR_COUNTS[repo]

export const authored = (projects = OSS_PROJECTS): OssProject[] =>
  projects.filter((project) => project.role === 'author')

export const contributed = (projects = OSS_PROJECTS): OssProject[] =>
  projects.filter((project) => project.role === 'contributor')

export const featured = (projects = OSS_PROJECTS): OssProject[] =>
  projects.filter((project) => project.featured)

/** Published packages across the authored monorepos. Private tooling excluded. */
export const publishedPackages = (projects = OSS_PROJECTS): OssPackage[] =>
  projects.flatMap((project) => project.packages ?? [])

/** The monorepos shipped under a given org, in the order the record lists them. */
export const byOrg = (
  orgId: string = RXOVA_ORG.id,
  projects = OSS_PROJECTS
): OssProject[] => projects.filter((project) => project.org === orgId)
