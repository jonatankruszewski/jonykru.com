import { describe, expect, it } from 'vitest'
import { SITE_URL, SOCIALS } from '@/data/site'
import { personSchema, websiteSchema } from '@/lib/structuredData'

describe('personSchema', () => {
  it('declares a Person under the canonical schema.org context', () => {
    const schema = personSchema()
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Person')
    expect(schema.name).toBeTruthy()
    expect(schema.url).toBe(SITE_URL)
  })

  it('links every social profile via sameAs, from the shared source', () => {
    expect(personSchema().sameAs).toEqual([
      SOCIALS.github,
      SOCIALS.linkedin,
      SOCIALS.medium,
      SOCIALS.stackOverflow
    ])
  })
})

describe('websiteSchema', () => {
  it('declares a WebSite pointing at the site url', () => {
    const schema = websiteSchema()
    expect(schema['@type']).toBe('WebSite')
    expect(schema.url).toBe(SITE_URL)
    expect(schema.url).toMatch(/^https:\/\//)
  })
})
