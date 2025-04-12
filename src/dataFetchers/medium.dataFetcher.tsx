import { MediumData } from '@/types/medium.types'
import mediumBackup from '@/dataFetchers/medium.backup.json'
export const getMediumData = async () => {
  const res = await fetch(
    'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@jonakrusze',
    {
      next: { revalidate: 3600 }
    }
  )

  if (!res.ok && process.env.NODE_ENV !== 'production') {
    return mediumBackup
  }

  if (!res.ok) {
    throw new Error('Failed to fetch Medium')
  }

  return (await res.json()) as MediumData
}
