import { CredlyData } from '@/types/credly.types'
import credlyData from './credly.backup.json'

/**
 * Returns Credly badges from local JSON file.
 * To update badges, run: node scripts/update-credly-badges.js
 */
export const getCredlyData = async (): Promise<CredlyData> => {
  return credlyData as CredlyData
}
