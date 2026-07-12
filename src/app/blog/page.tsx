import type { Metadata } from 'next'
import BlogView from '@/views/BlogView'

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Technical essays on architecture, migrations, TypeScript and the real cost of tech debt.',
  alternates: { canonical: '/blog' },
  openGraph: { url: '/blog', images: ['/og/blog.png'] },
  twitter: { card: 'summary_large_image', images: ['/og/blog.png'] }
}

export default function WritingPage() {
  return <BlogView />
}
