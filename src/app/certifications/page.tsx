import type { Metadata } from 'next'
import CertificationsView from '@/views/CertificationsView'

export const metadata: Metadata = {
  title: 'Certifications',
  description:
    '33 exams graded by someone other than me — thirteen from Scrum.org, plus AWS, Microsoft Azure, Google Cloud, GitHub, GitLab, MongoDB and the Python Institute.',
  alternates: { canonical: '/certifications' },
  openGraph: { url: '/certifications', images: ['/og/certifications.png'] },
  twitter: { card: 'summary_large_image', images: ['/og/certifications.png'] }
}

export default function CertificationsPage() {
  return <CertificationsView />
}
