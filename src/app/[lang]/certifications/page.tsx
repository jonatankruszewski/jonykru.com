import type { Metadata } from 'next'
import { isLocale } from '@/lib/locale'
import { buildMetadata } from '@/lib/metadata'
import CertificationsView from '@/views/CertificationsView'

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return isLocale(lang) ? buildMetadata(lang, 'certifications') : {}
}

export default function CertificationsPage() {
  return <CertificationsView />
}
