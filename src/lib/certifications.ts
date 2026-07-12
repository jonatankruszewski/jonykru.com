import type { CredlyBadge } from '@/types/credly.types'

/**
 * Credly's export contains the same badge twice when it has been re-issued
 * (AWS Certified Cloud Practitioner, at time of writing). The raw list is 34
 * rows but only 33 distinct certifications — the old site rendered "36".
 */
export const dedupeBadges = (badges: CredlyBadge[]): CredlyBadge[] => {
  const seen = new Set<string>()

  return badges.filter((badge) => {
    const key = badge.badge_template.name
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export const issuerOf = (badge: CredlyBadge): string =>
  badge.issuer_linked_in_name ?? 'Other'

export const issuersOf = (badges: CredlyBadge[]): string[] =>
  [...new Set(badges.map(issuerOf))].sort((a, b) => a.localeCompare(b))

export const groupByIssuer = (
  badges: CredlyBadge[]
): Record<string, CredlyBadge[]> =>
  badges.reduce<Record<string, CredlyBadge[]>>((groups, badge) => {
    const issuer = issuerOf(badge)
    groups[issuer] = [...(groups[issuer] ?? []), badge]
    return groups
  }, {})

export const filterByIssuer = (
  badges: CredlyBadge[],
  issuer: string | null
): CredlyBadge[] =>
  issuer === null ? badges : badges.filter((badge) => issuerOf(badge) === issuer)

/**
 * Badges that back the AI positioning. Surfaced on the home page; the full set
 * (which skews heavily toward Scrum) lives at /certifications.
 */
const AI_BADGE_NAMES = [
  'AWS Certified AI Practitioner',
  'Microsoft Certified: Azure AI Fundamentals',
  'GitHub Copilot'
]

export const aiBadges = (badges: CredlyBadge[]): CredlyBadge[] =>
  AI_BADGE_NAMES.map((name) =>
    badges.find((badge) => badge.badge_template.name.includes(name))
  ).filter((badge): badge is CredlyBadge => badge !== undefined)
