import type { MediumFlatData } from '@/types/medium.types'

/**
 * Medium's RSS feed only ever returns the latest 10 posts, so this list is
 * "the latest 10", not a lifetime total. The old site claimed "24+", which the
 * data cannot support — don't reintroduce a total here.
 */
export const sortByDateDesc = (
  articles: MediumFlatData[]
): MediumFlatData[] =>
  [...articles].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )

export const latest = (
  articles: MediumFlatData[],
  count: number
): MediumFlatData[] => sortByDateDesc(articles).slice(0, count)
