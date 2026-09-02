import starCounts from '@/data/starCounts.json'
import type { OssOrg, OssPackage, OssProject } from '@/types/openSource.types'

/**
 * The open-source record. Data only — the functions that query it live in
 * src/lib/openSource.ts.
 *
 * Every entry is verified against GitHub and npm. Contribution status is
 * modelled explicitly so an open PR can never be rendered as merged, and the
 * package lists are the published ones only — each of these monorepos also
 * carries private workspace tooling that nobody can install.
 */
const npmUrl = (name: string) => `https://www.npmjs.com/package/${name}`

/**
 * Docs live on the org site, one page per monorepo — keyed by project slug, not
 * by package name (`/packages/journey-core/` is a 404; `/packages/journey/` is
 * the page that documents all three of its packages).
 */
const docsUrl = (slug: string) => `https://rxova.org/packages/${slug}/`

/** A published package, named once — the npm URL follows from the name. */
const pkg = (name: string): OssPackage => ({ name, url: npmUrl(name) })

/**
 * The org the authored work ships under. Naming it lets the page present one
 * org with a site, a GitHub home and a shared release pipeline, rather than a
 * list of repos that happen to share a prefix.
 */
export const RXOVA_ORG: OssOrg = {
  id: 'rxova',
  name: 'rxova',
  url: 'https://rxova.org',
  github: 'https://github.com/rxova',
  taglineKey: 'oss.org.rxova.tagline',
  blurbKey: 'oss.org.rxova.blurb',
  roleKey: 'oss.org.rxova.role'
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
    name: 'Journey',
    repo: 'rxova/journey',
    url: 'https://github.com/rxova/journey',
    role: 'author',
    language: 'TypeScript',
    npm: npmUrl('@rxova/journey-core'),
    blurbKey: 'oss.projects.journey.blurb',
    docs: docsUrl('journey'),
    featured: true,
    org: RXOVA_ORG.id,
    packages: [
      '@rxova/journey-core',
      '@rxova/journey-react',
      '@rxova/journey-devtools-bridge'
    ].map(pkg)
  },
  {
    slug: 'react-inputs',
    name: 'react-inputs',
    repo: 'rxova/react-inputs',
    url: 'https://github.com/rxova/react-inputs',
    role: 'author',
    language: 'TypeScript',
    npm: npmUrl('@rxova/react-inputs'),
    blurbKey: 'oss.projects.reactInputs.blurb',
    docs: docsUrl('react-inputs'),
    featured: true,
    org: RXOVA_ORG.id,
    // The suite first, then the nine inputs it bundles, then the codemod.
    // @rxova/demo-kit and @rxova/utils are private workspace packages.
    packages: [
      '@rxova/react-inputs',
      '@rxova/react-date-input',
      '@rxova/react-file-input',
      '@rxova/react-intl-currency-input',
      '@rxova/react-otp-input',
      '@rxova/react-password-input',
      '@rxova/react-phone-input',
      '@rxova/react-rating-input',
      '@rxova/react-tags-input',
      '@rxova/react-time-input',
      '@rxova/codemod'
    ].map(pkg)
  },
  {
    slug: 'use-everywhere',
    name: 'use-everywhere',
    repo: 'rxova/use-everywhere',
    url: 'https://github.com/rxova/use-everywhere',
    role: 'author',
    language: 'TypeScript',
    npm: npmUrl('use-everywhere'),
    blurbKey: 'oss.projects.useEverywhere.blurb',
    docs: docsUrl('use-everywhere'),
    featured: true,
    org: RXOVA_ORG.id,
    // @use-everywhere/benchmarks and /tooling are private workspace packages.
    packages: [
      'use-everywhere',
      '@use-everywhere/core',
      'eslint-plugin-use-everywhere',
      '@use-everywhere/test-utils'
    ].map(pkg)
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
    slug: 'pie',
    name: 'PIE',
    repo: 'justeattakeaway/pie',
    url: 'https://github.com/justeattakeaway/pie',
    role: 'contributor',
    language: 'TypeScript',
    blurbKey: 'oss.projects.pie.blurb',
    contributions: [
      {
        ref: 'PR #2458',
        url: 'https://github.com/justeattakeaway/pie/pull/2458',
        titleKey: 'oss.projects.pie.pr2458',
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
        ref: 'PR #1272',
        url: 'https://github.com/immerjs/immer/pull/1272',
        titleKey: 'oss.projects.immer.pr1272',
        status: 'merged'
      },
      {
        ref: 'Issue #1268',
        url: 'https://github.com/immerjs/immer/issues/1268',
        titleKey: 'oss.projects.immer.issue1268',
        status: 'resolved'
      },
      {
        ref: 'PR #1269',
        url: 'https://github.com/immerjs/immer/pull/1269',
        titleKey: 'oss.projects.immer.pr1269',
        status: 'closed'
      }
    ]
  }
]

/** Refreshed by `pnpm update-oss` rather than hand-typed into a component. */
export const STAR_COUNTS: Record<string, number> = starCounts
