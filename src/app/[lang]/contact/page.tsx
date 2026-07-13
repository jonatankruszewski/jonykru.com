import type { Metadata } from 'next'
import { isLocale } from '@/lib/locale'
import { buildMetadata } from '@/lib/metadata'
import ContactView from '@/views/ContactView'

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return isLocale(lang) ? buildMetadata(lang, 'contact') : {}
}

export default function ContactPage() {
  return <ContactView />
}
