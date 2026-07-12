import credly from '@/dataFetchers/credly.backup.json'
import mediumData from '@/dataFetchers/mediumData.json'
import { OSS_PROJECTS } from '@/data/openSource'
import { CAREER_START } from '@/data/site'
import { dedupeBadges } from '@/lib/certifications'
import type { CredlyBadge } from '@/types/credly.types'
import type { MediumFlatData } from '@/types/medium.types'

export type SiteStats = {
  certifications: number
  articles: number
  openSourceProjects: number
  yearsOfExperience: number
}

export const yearsOfExperience = (
  now: Date = new Date(),
  start: Date = CAREER_START
): number => {
  const years = now.getFullYear() - start.getFullYear()
  const beforeAnniversary =
    now.getMonth() < start.getMonth() ||
    (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())

  return Math.max(0, beforeAnniversary ? years - 1 : years)
}

/**
 * Every headline number on the site comes from here, derived from the real
 * datasets. The previous design hand-typed them into JSX and drifted: it
 * advertised 36 certifications (33) and 24+ articles (10).
 */
export const getStats = (now: Date = new Date()): SiteStats => ({
  certifications: dedupeBadges(credly.data as CredlyBadge[]).length,
  articles: (mediumData as MediumFlatData[]).length,
  openSourceProjects: OSS_PROJECTS.length,
  yearsOfExperience: yearsOfExperience(now)
})
