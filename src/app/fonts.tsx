import { JetBrains_Mono, Rubik } from 'next/font/google'

// Mono carries the eyebrow labels, tags and stat numerals — half of the flat look.
export const FontJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-jetbrains'
})

// Rubik is the only family on the site. It ships a Hebrew subset, so the /he
// headlines stay in the brand face instead of falling back to a system font.
export const FontRubik = Rubik({
  subsets: ['latin', 'hebrew'],
  display: 'swap',
  preload: true,
  variable: '--font-rubik'
})
