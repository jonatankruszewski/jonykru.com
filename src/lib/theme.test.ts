import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { lightMediaPalette, paletteFor } from '@/lib/theme'

const css = fs.readFileSync(
  path.join(process.cwd(), 'src/app/globals.css'),
  'utf8'
)

const dark = paletteFor(css, 'html.dark')
const light = paletteFor(css, 'html.light')
const lightMedia = lightMediaPalette(css)

const TOKENS = [
  '--canvas',
  '--surface',
  '--ink',
  '--ink-muted',
  '--rule',
  '--accent',
  '--accent-ink',
  '--error',
  '--syn-keyword',
  '--syn-string',
  '--syn-number',
  '--syn-function',
  '--syn-const',
  '--syn-comment'
]

describe('theme palettes', () => {
  it('parses all three blocks', () => {
    expect(Object.keys(dark).length).toBeGreaterThan(0)
    expect(Object.keys(light).length).toBeGreaterThan(0)
    expect(Object.keys(lightMedia).length).toBeGreaterThan(0)
  })

  it('the two light palettes are identical', () => {
    // CSS cannot share a block across a media query, so the light palette is
    // written twice. This is the guard against the copies drifting.
    expect(light).toEqual(lightMedia)
  })

  it.each([
    ['dark', () => dark],
    ['light', () => light],
    ['light (media)', () => lightMedia]
  ])('%s defines every token', (_name, get) => {
    expect(Object.keys(get()).sort()).toEqual([...TOKENS].sort())
  })

  it('every theme resolves a token to a literal colour, never to another var', () => {
    for (const palette of [dark, light, lightMedia]) {
      for (const value of Object.values(palette)) {
        expect(value).toMatch(/^#[0-9a-f]{3,8}$/)
      }
    }
  })

  it('dark and light actually differ', () => {
    expect(dark['--canvas']).not.toBe(light['--canvas'])
    expect(dark['--ink']).not.toBe(light['--ink'])
  })
})
