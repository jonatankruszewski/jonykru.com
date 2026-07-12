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

/** A published npm package. Private workspace tooling is deliberately excluded. */
export type OssPackage = {
  name: string
  url: string
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
  /** Authored projects are monorepos; these are the packages they ship. */
  packages?: OssPackage[]
  contributions?: Contribution[]
}
