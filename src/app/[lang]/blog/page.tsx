import type { Metadata } from 'next'
import { isLocale } from '@/lib/locale'
import { buildMetadata } from '@/lib/metadata'
import BlogView from '@/views/BlogView'

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return isLocale(lang) ? buildMetadata(lang, 'blog') : {}
}

export default function BlogPage() {
  return <BlogView />
}
