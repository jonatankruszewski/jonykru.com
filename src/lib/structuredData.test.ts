import { describe, expect, it } from 'vitest'
import { SITE_URL, SOCIALS } from '@/data/site'
import {
  personSchema,
  serializeJsonLd,
  websiteSchema
} from '@/lib/structuredData'

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

describe('serializeJsonLd', () => {
  it('escapes <, > and & so React emits it verbatim and it cannot break the tag', () => {
    const serialized = serializeJsonLd({ x: '</script> a > b && c < d' })
    expect(serialized).not.toMatch(/[<>&]/)
    expect(serialized).toContain('\\u003c')
    expect(serialized).toContain('\\u003e')
    expect(serialized).toContain('\\u0026')
  })

  it('stays valid JSON that round-trips back to the original', () => {
    const parsed = JSON.parse(serializeJsonLd({ x: '</script> & <b>' }))
    expect(parsed.x).toBe('</script> & <b>')
    expect(JSON.parse(serializeJsonLd(personSchema()))['@type']).toBe('Person')
  })
})
