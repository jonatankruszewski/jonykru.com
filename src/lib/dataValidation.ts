import type { CredlyBadge } from '@/types/credly.types'
import type { MediumFlatData } from '@/types/medium.types'

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

/**
 * Type guards for the two external datasets — the Credly badges and the flattened
 * Medium feed. Both are pulled from third parties by the refresh scripts, so an
 * upstream shape change would otherwise surface as blank cards in the rendered
 * site. Validating at the boundary (a test runs these over the committed JSON in
 * CI) turns that into a loud, early failure that names the offending record.
 *
 * The guards check exactly the fields the UI renders, so they fail on real
 * breakage without being brittle about fields nothing reads.
 */
export const isCredlyBadge = (value: unknown): value is CredlyBadge => {
  if (!value || typeof value !== 'object') return false
  const badge = value as Record<string, unknown>
  const template = badge.badge_template

  return (
    isNonEmptyString(badge.id) &&
    isNonEmptyString(badge.image_url) &&
    isNonEmptyString(badge.issuer_linked_in_name) &&
    !!template &&
    typeof template === 'object' &&
    isNonEmptyString((template as Record<string, unknown>).name) &&
    isNonEmptyString((template as Record<string, unknown>).url)
  )
}

export const isMediumArticle = (value: unknown): value is MediumFlatData => {
  if (!value || typeof value !== 'object') return false
  const article = value as Record<string, unknown>

  return (
    isNonEmptyString(article.title) &&
    isNonEmptyString(article.guid) &&
    isNonEmptyString(article.link) &&
    isNonEmptyString(article.pubDate) &&
    Array.isArray(article.categories)
  )
}

/**
 * Asserts every row passes `guard`, returning the narrowed array. Throws with the
 * offending index so a bad refresh names exactly what broke.
 */
export const assertValid = <T>(
  rows: readonly unknown[],
  guard: (value: unknown) => value is T,
  label: string
): T[] => {
  rows.forEach((row, index) => {
    if (!guard(row)) {
      throw new Error(`${label}: malformed record at index ${index}`)
    }
  })
  return rows as T[]
}
