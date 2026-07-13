import type { Metadata } from 'next'
import { isLocale } from '@/lib/locale'
import { buildMetadata } from '@/lib/metadata'
import HomeView from '@/views/HomeView'

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return isLocale(lang) ? buildMetadata(lang, 'home') : {}
}

export default function HomePage() {
  return <HomeView />
}
