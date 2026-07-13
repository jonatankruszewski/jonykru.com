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
  it('escapes < so the payload cannot break out of the script tag', () => {
    const serialized = serializeJsonLd({ x: '</script><script>alert(1)' })
    expect(serialized).not.toContain('</script>')
    expect(serialized).toContain('\\u003c')
  })

  it('stays valid JSON that round-trips back to the original', () => {
    const parsed = JSON.parse(serializeJsonLd(personSchema()))
    expect(parsed['@type']).toBe('Person')
    expect(parsed.url).toBe(SITE_URL)
  })
})
