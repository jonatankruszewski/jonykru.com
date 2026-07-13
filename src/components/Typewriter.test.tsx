// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import Typewriter from '@/components/Typewriter'

beforeAll(() => {
  window.matchMedia = (query: string) =>
    ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false
    }) as unknown as MediaQueryList
})

// jsdom can't measure pixels, so this guards the *mechanism* that keeps the
// headline from shifting the page: every phrase is rendered as an invisible
// ghost stacked into one grid cell, so the box always reserves the tallest
// phrase's height while the visible line types, erases and rewraps. A
// pixel-accurate check lives in the Playwright e2e spec.
describe('Typewriter CLS guard', () => {
  const phrases = [
    'short',
    'a considerably longer phrase that is likely to wrap onto a second line',
    'medium length line'
  ]

  it('renders one invisible ghost per phrase, each pinned to the shared grid cell', () => {
    const { container } = render(<Typewriter phrases={phrases} />)

    const root = container.firstElementChild
    expect(root?.className).toContain('grid')

    const ghosts = Array.from(container.querySelectorAll('span.invisible'))
    expect(ghosts).toHaveLength(phrases.length)

    ghosts.forEach((ghost, i) => {
      expect(ghost.textContent).toContain(phrases[i])
      expect(ghost.className).toContain('[grid-area:1/1]')
    })
  })

  it('stacks the animated line in the same grid cell as the ghosts', () => {
    const { container } = render(<Typewriter phrases={phrases} />)

    const animated = container.querySelector(
      'span[aria-hidden]:not(.invisible)'
    )
    expect(animated?.className).toContain('[grid-area:1/1]')
  })
})
