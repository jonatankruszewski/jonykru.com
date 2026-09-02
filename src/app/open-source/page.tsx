import type { Metadata } from 'next'
import { getStats } from '@/lib/stats'
import OpenSourceView from '@/views/OpenSourceView'

// Derived, not hand-typed — the same rule the visible copy follows. A fourth
// monorepo should never leave the search snippet advertising three.
const { authoredProjects, publishedPackages } = getStats()

export const metadata: Metadata = {
  title: 'Open Source',
  description: `rxova, the TypeScript library org I founded and run — ${authoredProjects} monorepos, ${publishedPackages} published packages — plus code merged into codebases I do not own: immer, typedash and Pane, an open-source AI agent manager.`,
  alternates: { canonical: '/open-source' },
  openGraph: { url: '/open-source', images: ['/og/open-source.png'] },
  twitter: { card: 'summary_large_image', images: ['/og/open-source.png'] }
}

export default function OpenSourcePage() {
  return <OpenSourceView />
}
