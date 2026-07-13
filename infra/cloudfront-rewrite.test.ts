import { readFileSync } from 'fs'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

// The CloudFront Function is a plain (non-module) `function handler(event)` that
// runs at the edge, so we load its source and evaluate it to exercise the
// routing logic here — the one part of the [lang] setup that can't be verified
// by a normal build.
const source = readFileSync(
  join(process.cwd(), 'infra/cloudfront-rewrite.js'),
  'utf8'
)
const handler = new Function(`${source}; return handler;`)() as (event: {
  request: { uri: string }
}) => { uri?: string; statusCode?: number; headers?: Record<string, unknown> }

const run = (uri: string) => handler({ request: { uri } })

describe('cloudfront-rewrite handler', () => {
  it('serves the default locale homepage from the bare root', () => {
    expect(run('/').uri).toBe('/en/index.html')
    expect(run('').uri).toBe('/en/index.html')
  })

  it('resolves a locale directory to its index.html', () => {
    expect(run('/en/').uri).toBe('/en/index.html')
    expect(run('/es/blog/').uri).toBe('/es/blog/index.html')
    expect(run('/he/certifications/').uri).toBe('/he/certifications/index.html')
  })

  it('301s an extensionless path without a trailing slash', () => {
    const res = run('/es/blog')
    expect(res.statusCode).toBe(301)
  })

  it('leaves static assets (with a file extension) untouched', () => {
    expect(run('/_next/static/x.js').uri).toBe('/_next/static/x.js')
  })
})
