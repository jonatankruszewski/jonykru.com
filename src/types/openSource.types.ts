export type OssRole = 'author' | 'contributor'

/**
 * 'merged'   — landed in the upstream repo.
 * 'open'     — proposed, still under review.
 * 'closed'   — proposed and not accepted. The maintainers solved it another way.
 * 'resolved' — a reported issue the maintainers closed as fixed.
 *
 * Anyone can click through to the upstream thread, so a contribution must never
 * be rendered as though it shipped, and a closed one must never read as open.
 */
export type ContributionStatus = 'merged' | 'open' | 'closed' | 'resolved'

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
  /**
   * What I am to the org itself, not to any one repo. Founding and running the
   * org — the name, the site, the release pipeline — is the work the per-repo
   * 'author' role can't express.
   */
  roleKey: string
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
  /** The project's page on the org docs site. Authored work only. */
  docs?: string
  featured?: boolean
  /** Set on authored work; matches `OssOrg.id`. Absent on other people's repos. */
  org?: string
  /** Authored projects are monorepos; these are the packages they ship. */
  packages?: OssPackage[]
  contributions?: Contribution[]
}
