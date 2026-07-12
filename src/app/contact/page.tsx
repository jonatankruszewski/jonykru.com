import type { Metadata } from 'next'
import ContactView from '@/views/ContactView'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Book a call — thirty minutes, no pitch. Or send a message and I will reply within a couple of days.',
  alternates: { canonical: '/contact' }
}

export default function ContactPage() {
  return <ContactView />
}
