import type { Metadata } from 'next'
import CertificationsView from '@/views/CertificationsView'

export const metadata: Metadata = {
  title: 'Certifications',
  description:
    'Externally validated across AWS, Microsoft Azure, Google Cloud, GitHub, MongoDB, the Python Institute and Scrum.org.',
  alternates: { canonical: '/certifications' }
}

export default function CertificationsPage() {
  return <CertificationsView />
}
