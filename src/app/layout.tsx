import type { Metadata, Viewport } from 'next'
import './globals.css'
import '@/styles/animations.css'
import { ReactNode } from 'react'
import { FontInter } from '@/app/fonts'
import { I18nProvider } from '@/context/i18nContext'
import { ThemeProvider } from '@/context/themeContext'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' }
  ]
}

export const metadata: Metadata = {
  title: 'Jonatan Kruszewski - Web Developer | Software Engineer',
  description:
    'Experienced web developer, tech instructor, and Scrum consultant. Offering private lessons, tech guidance, and Agile consulting. Showcasing 24 published articles and nearly 40 certifications. Explore my work and expertise in React, TypeScript, and modern web development.'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={FontInter.className}>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
