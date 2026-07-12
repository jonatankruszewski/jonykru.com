import type { Metadata } from 'next'
import OpenSourceView from '@/views/OpenSourceView'

export const metadata: Metadata = {
  title: 'Open Source',
  description:
    'Libraries I wrote under the rxova org, and merged contributions to Pane — an open-source AI agent manager — typedash and immer.',
  alternates: { canonical: '/open-source' },
  openGraph: { url: '/open-source', images: ['/og/open-source.png'] },
  twitter: { card: 'summary_large_image', images: ['/og/open-source.png'] }
}

export default function OpenSourcePage() {
  return <OpenSourceView />
}
