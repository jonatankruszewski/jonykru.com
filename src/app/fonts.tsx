import { JetBrains_Mono, Rubik } from 'next/font/google'

export const FontJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: true
})

// Rubik: Geometric, brutalist font with native Hebrew support
export const FontRubik = Rubik({
  subsets: ['latin', 'hebrew'],
  display: 'swap',
  preload: true
})

// Alias for backward compatibility
export const FontInter = FontRubik
