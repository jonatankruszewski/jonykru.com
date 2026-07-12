import { describe, expect, it } from 'vitest'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import he from '@/locales/he.json'

const LOCALES: [string, string[]][] = [
  ['en', en.home.headlinePhrases],
  ['es', es.home.headlinePhrases],
  ['he', he.home.headlinePhrases]
]

describe('hero headline phrases', () => {
  it.each(LOCALES)('%s has five phrases', (_locale, phrases) => {
    expect(phrases).toHaveLength(5)
  })

  it.each(LOCALES)(
    '%s phrases are close in length, so the typed line does not reflow',
    (_locale, phrases) => {
      // A phrase far longer than the others wraps to a second line mid-animation
      // and shoves the CTAs down. Keep them within a tight band.
      const lengths = phrases.map((phrase) => phrase.length)
      const spread = Math.max(...lengths) - Math.min(...lengths)

      expect(spread, `lengths: ${lengths.join(', ')}`).toBeLessThanOrEqual(8)
      expect(Math.max(...lengths)).toBeLessThanOrEqual(36)
    }
  )

  it.each(LOCALES)(
    '%s headline matches the first phrase',
    (_locale, phrases) => {
      const dict = { en, es, he }[_locale as 'en' | 'es' | 'he']
      expect(dict.home.headline).toBe(phrases[0])
    }
  )
})
