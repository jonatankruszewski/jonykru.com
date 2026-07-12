import type { Metadata } from 'next'
import ContactView from '@/views/ContactView'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Book a call — thirty minutes, no pitch. Or send a message and I will reply within a couple of days.',
  alternates: { canonical: '/contact' },
  openGraph: { url: '/contact', images: ['/og/contact.png'] },
  twitter: { card: 'summary_large_image', images: ['/og/contact.png'] }
}

export default function ContactPage() {
  return <ContactView />
}
