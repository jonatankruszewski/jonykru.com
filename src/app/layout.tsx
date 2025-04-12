import type { Metadata } from 'next'
import './globals.css'
import '@/styles/animations.css'
import { ReactNode } from 'react'
import { FontInter } from '@/app/fonts'

export const metadata: Metadata = {
  title: 'Jonatan Kruszewski - Web Developer | Software Engineer',
  description:
    'Experienced web developer, tech instructor, and Scrum consultant. Offering private lessons, tech guidance, and Agile consulting. Showcasing 24 published articles and nearly 40 certifications. Explore my work and expertise in React, TypeScript, and modern web development.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={FontInter.className}>{children}</body>
    </html>
  )
}
