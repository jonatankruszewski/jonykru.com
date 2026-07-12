import type { Metadata } from 'next'
import BlogView from '@/views/BlogView'

export const metadata: Metadata = {
  title: 'Blog Posts',
  description:
    'Essays on Medium about architecture, migrations, TypeScript and the real cost of tech debt — written to learn it twice, and to pay back the posts that got me unstuck.',
  alternates: { canonical: '/blog' },
  openGraph: { url: '/blog', images: ['/og/blog.png'] },
  twitter: { card: 'summary_large_image', images: ['/og/blog.png'] }
}

export default function WritingPage() {
  return <BlogView />
}
