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
 * Serializes a schema for inline injection into a <script> tag. Escapes `<` to
 * its unicode form so the payload can never break out of the closing
 * </script> — defence in depth, since every value here is already static and
 * controlled. This is the only reason the layout needs dangerouslySetInnerHTML:
 * React would HTML-escape a string child and corrupt the JSON.
 */
export const serializeJsonLd = (schema: object): string =>
  JSON.stringify(schema).replace(/</g, '\\u003c')
