import en from '@/locales/en.json'

/** English is the source of truth; es/he are checked against it. */
export type Dictionary = typeof en

export const flattenKeys = (value: unknown, prefix = ''): string[] => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix]
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([key, v]) =>
    flattenKeys(v, prefix ? `${prefix}.${key}` : key)
  )
}

/** Keys present in `reference` but missing from `candidate`. */
export const missingKeys = (
  reference: unknown,
  candidate: unknown
): string[] => {
  const candidateKeys = new Set(flattenKeys(candidate))
  return flattenKeys(reference).filter((key) => !candidateKeys.has(key))
}

/**
 * Fills `{token}` placeholders in a copy string from `params`. This is how
 * headline numbers reach the prose without being typed by hand — the same
 * derived stats that power the stat blocks. Copy that passes no params, and any
 * token with no matching key, is left exactly as written.
 */
export const interpolate = (
  template: string,
  params?: Record<string, string | number>
): string =>
  params
    ? template.replace(/\{(\w+)\}/g, (match, token: string) =>
        token in params ? String(params[token]) : match
      )
    : template
