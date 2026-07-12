import { describe, expect, it } from 'vitest'
import { isActiveRoute, NAV_ROUTES, ROUTES } from '@/lib/nav'

describe('ROUTES', () => {
  it('has no duplicate hrefs', () => {
    const hrefs = ROUTES.map((r) => r.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('excludes home from the header nav', () => {
    expect(NAV_ROUTES.some((r) => r.href === '/')).toBe(false)
    expect(NAV_ROUTES).toHaveLength(ROUTES.length - 1)
  })
})

describe('isActiveRoute', () => {
  it('matches despite the trailing slash that trailingSlash: true produces', () => {
    expect(isActiveRoute('/blog/', '/blog')).toBe(true)
  })

  it('matches when neither side has a trailing slash', () => {
    expect(isActiveRoute('/blog', '/blog')).toBe(true)
  })

  it('matches home', () => {
    expect(isActiveRoute('/', '/')).toBe(true)
  })

  it('does not match a different route', () => {
    expect(isActiveRoute('/blog/', '/certifications')).toBe(false)
  })

  it('does not treat home as active on every route', () => {
    expect(isActiveRoute('/blog/', '/')).toBe(false)
  })
})
