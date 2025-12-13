import { expect, test } from '@playwright/test'
import credlyData from '../src/dataFetchers/credly.backup.json'
import mediumData from '../src/dataFetchers/mediumData.json'

/**
 * Tests to verify all external links (publications and badges) are accessible
 */

test.describe('Publications Links', () => {
  const articles = mediumData

  for (const article of articles) {
    // Extract article ID from guid for unique test name
    const articleId = article.guid.split('/').pop() || article.guid

    test(`Publication [${articleId}]: "${article.title}"`, async ({
      request
    }, testInfo) => {
      // Add URL as annotation for easy debugging
      testInfo.annotations.push({ type: 'url', description: article.link })

      const response = await request.head(article.link, {
        timeout: 15000,
        maxRedirects: 5
      })

      // Medium links should return 200 or redirect (3xx)
      expect(
        response.ok() || (response.status() >= 300 && response.status() < 400),
        `Expected ${article.link} to be accessible, got status ${response.status()}`
      ).toBeTruthy()
    })
  }
})

test.describe('Certification Badge Links', () => {
  const badges = credlyData.data

  for (const badge of badges) {
    const url = badge.badge_template.url

    // Skip invalid URLs
    if (!url || !url.startsWith('http')) {
      continue
    }

    // Use badge ID for unique test name (first 8 chars)
    const badgeId = badge.id.slice(0, 8)

    test(`Badge [${badgeId}]: "${badge.badge_template.name}"`, async ({
      request
    }, testInfo) => {
      // Add URL as annotation for easy debugging
      testInfo.annotations.push({ type: 'url', description: url })

      const response = await request.head(url, {
        timeout: 15000,
        maxRedirects: 5
      })

      // Credly links should return 200 or redirect (3xx)
      expect(
        response.ok() || (response.status() >= 300 && response.status() < 400),
        `Expected ${url} to be accessible, got status ${response.status()}`
      ).toBeTruthy()
    })
  }
})
