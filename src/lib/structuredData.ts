import { SITE_URL, SOCIALS } from '@/data/site'

/**
 * JSON-LD identity for the site, rendered once in the root layout. It lets
 * search engines tie the domain to a person and their profiles (rich results,
 * knowledge-panel eligibility) — the structured-data counterpart to the human
 * metadata. Values come from the same source of truth the footer already uses,
 * so profiles can't drift between the visible links and the machine-readable
 * ones.
 */
export const personSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jonatan Kruszewski',
  url: SITE_URL,
  jobTitle: 'Software Engineer',
  sameAs: [
    SOCIALS.github,
    SOCIALS.linkedin,
    SOCIALS.medium,
    SOCIALS.stackOverflow
  ]
})

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Jonatan Kruszewski',
  url: SITE_URL
})

/**
 * Serializes a schema for rendering as the text child of a <script> tag.
 *
 * `<`, `>` and `&` are escaped to their unicode forms. That does two things at
 * once: React's own text-escaping becomes a no-op (so the JSON is emitted
 * byte-for-byte, no dangerouslySetInnerHTML needed), and the payload can never
 * break out of the closing </script>. Valid JSON either way — the escapes
 * round-trip through JSON.parse.
 */
export const serializeJsonLd = (schema: object): string =>
  JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
