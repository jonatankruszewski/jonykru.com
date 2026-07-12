import type { Metadata } from 'next'
import CertificationsView from '@/views/CertificationsView'

export const metadata: Metadata = {
  title: 'Certifications',
  description:
    'Externally validated across AWS, Microsoft Azure, Google Cloud, GitHub, MongoDB, the Python Institute and Scrum.org.',
  alternates: { canonical: '/certifications' },
  openGraph: { url: '/certifications', images: ['/og/certifications.png'] },
  twitter: { card: 'summary_large_image', images: ['/og/certifications.png'] }
}

export default function CertificationsPage() {
  return <CertificationsView />
}
