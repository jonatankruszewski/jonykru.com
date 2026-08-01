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

/**
 * The org an authored project ships under. The authored work is not a pile of
 * unrelated repos — it's one org with a name, a site and a shared release
 * process — so the org is modelled rather than left implied by the repo slug.
 */
export type OssOrg = {
  id: string
  name: string
  /** The org's own site. */
  url: string
  /** The GitHub org the repos live in. */
  github: string
  taglineKey: string
  blurbKey: string
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
  /** Set on authored work; matches `OssOrg.id`. Absent on other people's repos. */
  org?: string
  /** Authored projects are monorepos; these are the packages they ship. */
  packages?: OssPackage[]
  contributions?: Contribution[]
}
