import type { Metadata } from 'next'
import WritingView from '@/views/WritingView'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Technical essays on architecture, migrations, TypeScript and the real cost of tech debt.',
  alternates: { canonical: '/writing' }
}

export default function WritingPage() {
  return <WritingView />
}
