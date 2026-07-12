import { describe, expect, it } from 'vitest'
import { findViolations } from './check-flat'

describe('findViolations', () => {
  it('flags a box shadow', () => {
    const found = findViolations('a.tsx', '<div className="shadow-lg" />')
    expect(found).toHaveLength(1)
    expect(found[0].rule).toBe('no-shadow')
  })

  it('flags a dark-variant shadow', () => {
    expect(
      findViolations('a.tsx', '<div className="dark:shadow-md" />')
    ).toHaveLength(1)
  })

  it('flags a gradient', () => {
    const found = findViolations(
      'a.tsx',
      '<div className="bg-gradient-to-r" />'
    )
    expect(found[0].rule).toBe('no-gradient')
  })

  it('flags a backdrop blur', () => {
    expect(
      findViolations('a.tsx', '<div className="backdrop-blur-sm" />')
    ).toHaveLength(1)
  })

  it('flags a raw hex colour that bypasses the tokens', () => {
    const found = findViolations('a.tsx', '<div className="bg-[#1E1E2E]" />')
    expect(found[0].rule).toBe('no-raw-hex')
  })

  it('reports the line number', () => {
    const found = findViolations('a.tsx', 'ok\nok\n<i className="shadow-sm" />')
    expect(found[0].line).toBe(3)
  })

  it('passes on clean, tokenised markup', () => {
    const clean = '<div className="bg-canvas text-ink border-b border-rule" />'
    expect(findViolations('a.tsx', clean)).toEqual([])
  })

  it('does not flag unrelated utilities', () => {
    expect(findViolations('a.tsx', '<div className="grid-cols-2" />')).toEqual(
      []
    )
  })

  it('honours an explicit override comment', () => {
    const line = '<div className="shadow-lg" /> // check-flat-ignore'
    expect(findViolations('a.tsx', line)).toEqual([])
  })

  it('ignores the token resets that enforce flatness in the first place', () => {
    const theme = '  --shadow-*: initial;\n  --blur-*: initial;'
    expect(findViolations('globals.css', theme)).toEqual([])
  })

  it('reports the full class name, not a truncated prefix', () => {
    const found = findViolations('a.tsx', '<div className="shadow-lg" />')
    expect(found[0].match).toBe('shadow-lg')
  })
})
