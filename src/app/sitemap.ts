import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/site'
import { ROUTES } from '@/lib/nav'

export const dynamic = 'force-static'

// Generated from the same route table the nav reads, so a new page cannot ship
// in one and be missing from the other.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return ROUTES.filter((route) => route.indexable).map((route) => ({
    url: route.href === '/' ? `${SITE_URL}/` : `${SITE_URL}${route.href}/`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route.priority
  }))
}
