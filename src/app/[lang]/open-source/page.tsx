import type { Metadata } from 'next'
import { isLocale } from '@/lib/locale'
import { buildMetadata } from '@/lib/metadata'
import OpenSourceView from '@/views/OpenSourceView'

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return isLocale(lang) ? buildMetadata(lang, 'openSource') : {}
}

export default function OpenSourcePage() {
  return <OpenSourceView />
}
