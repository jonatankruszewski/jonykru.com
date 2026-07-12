import {
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Hebrew
} from 'next/font/google'

// The display/UI face. IBM Plex Mono carries the IDE feel — headings, labels,
// data, stat numerals.
export const FontPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-plex-mono'
})

// Body prose. Mono is exhausting to read at paragraph length.
export const FontPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-plex-sans'
})

// IBM Plex Mono has NO Hebrew coverage, so /he would otherwise fall back to a
// system font mid-headline. Plex Sans Hebrew sits after Mono in both stacks and
// picks up the Hebrew glyphs while staying in the Plex family.
export const FontPlexHebrew = IBM_Plex_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-plex-hebrew'
})
