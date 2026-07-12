#!/usr/bin/env node

/**
 * All-in-one script to update Medium articles
 *
 * This script:
 * 1. Fetches article data from Medium RSS feed via rss2json API
 * 2. Filters to only required fields
 * 3. Downloads article images, resizes to 370px width, and converts to WebP
 * 4. Saves to mediumData.json
 *
 * Usage:
 *   Run: pnpm update-medium
 */

import sharp from 'sharp'

import * as fs from 'fs'
import * as path from 'path'

const __dirname = path.resolve()

export const MEDIUM_API_URL =
  'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@jonakrusze'
export const DATA_JSON = path.join(
  __dirname,
  'src',
  'dataFetchers',
  'mediumData.json'
)
export const IMAGES_DIR = path.join(__dirname, 'public', 'images', 'medium')
export const MAX_IMAGE_WIDTH = 370

export interface MediumArticle {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  thumbnail: string
  description: string
  content: string
  enclosure?: Record<string, unknown>
  categories?: string[]
}

export interface MediumFeed {
  url: string
  title: string
  link: string
  author: string
  description: string
  image: string
}

export interface MediumApiResponse {
  status: string
  feed?: MediumFeed
  items: MediumArticle[]
}

export interface MediumFlatData {
  title: string
  pubDate: string
  guid: string
  link: string
  categories: string[]
  image: string
}

export interface DownloadStats {
  downloaded: number
  skipped: number
  failed: number
}

export interface UpdateOptions {
  silent?: boolean
}

/**
 * Create images directory if it doesn't exist
 */
export function ensureImagesDir(imagesDir: string): void {
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }
}

/**
 * Fetch data from Medium RSS API
 */
export async function fetchMediumData(
  apiUrl: string,
  _options: UpdateOptions = {}
): Promise<MediumApiResponse> {
  try {
    const response = await fetch(apiUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = (await response.json()) as MediumApiResponse

    if (data.status !== 'ok' || !data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid response from Medium API')
    }

    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to fetch from Medium: ${message}`)
  }
}

/**
 * Extract the first image URL from article content/description
 */
export function extractImageUrl(article: MediumArticle): string | null {
  const content = article.content || article.description || ''

  // Match src attribute from img tags
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i)
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1]
  }

  // Fallback to thumbnail if available
  if (article.thumbnail && article.thumbnail.trim() !== '') {
    return article.thumbnail
  }

  return null
}

/**
 * Extract article ID from guid URL
 */
export function extractArticleId(guid: string): string {
  // guid format: "https://medium.com/p/ed7faec2a8b6"
  const parts = guid.split('/')
  return parts[parts.length - 1]
}

/**
 * Download image from URL and return as Buffer
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      Referer: 'https://medium.com/'
    }
  })
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Download, resize, and convert an image to WebP format
 * Returns the final file path (always .webp)
 */
export async function downloadAndConvertToWebP(
  url: string,
  destPath: string,
  maxWidth: number
): Promise<string> {
  // Download the image
  const imageBuffer = await downloadImage(url)

  if (imageBuffer.length === 0) {
    throw new Error('Downloaded file is empty')
  }

  // Use sharp to resize and convert to WebP
  await sharp(imageBuffer)
    .resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .webp({
      quality: 80,
      effort: 6
    })
    .toFile(destPath)

  return destPath
}

/**
 * Filter data to only required fields and transform to flat structure
 */
export function filterMediumData(
  fullData: MediumApiResponse
): MediumFlatData[] {
  return fullData.items.map((article) => ({
    title: article.title,
    pubDate: article.pubDate,
    guid: article.guid,
    link: article.link,
    categories: article.categories || [],
    image: '' // Will be filled in by downloadImages
  }))
}

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Download all article images and convert to WebP
 */
export async function downloadImages(
  articles: MediumFlatData[],
  fullData: MediumApiResponse,
  imagesDir: string,
  maxWidth: number,
  options: UpdateOptions = {}
): Promise<MediumFlatData[]> {
  const verbose = !options.silent
  if (verbose) {
    console.log(
      `📥 Downloading article images (max ${maxWidth}px width, WebP format)...\n`
    )
  }

  const stats: DownloadStats = {
    downloaded: 0,
    skipped: 0,
    failed: 0
  }

  // Create a map of guid to original article for image extraction
  const articleMap = new Map<string, MediumArticle>()
  for (const article of fullData.items) {
    articleMap.set(article.guid, article)
  }

  let isFirstDownload = true

  for (const article of articles) {
    const originalArticle = articleMap.get(article.guid)
    if (!originalArticle) {
      if (verbose) {
        console.log(`⚠️  Skip: No original article found for ${article.guid}`)
      }
      stats.failed++
      continue
    }

    const imageUrl = extractImageUrl(originalArticle)
    if (!imageUrl) {
      if (verbose) {
        console.log(`⚠️  Skip: No image found for "${article.title}"`)
      }
      stats.failed++
      continue
    }

    const articleId = extractArticleId(article.guid)
    // Always use .webp extension
    const filename = `${articleId}.webp`
    const destPath = path.join(imagesDir, filename)
    const localUrl = `/images/medium/${filename}`

    // Check if already downloaded (WebP version)
    if (fs.existsSync(destPath)) {
      if (verbose) {
        console.log(`⏭️  Skip: ${filename} (already exists)`)
      }
      article.image = localUrl
      stats.skipped++
      continue
    }

    try {
      // Add delay between downloads to avoid rate limiting (429)
      if (!isFirstDownload) {
        await sleep(2000)
      }
      isFirstDownload = false

      if (verbose) {
        console.log(`⬇️  Downloading & converting: ${filename}...`)
      }
      await downloadAndConvertToWebP(imageUrl, destPath, maxWidth)
      article.image = localUrl
      stats.downloaded++
      if (verbose) {
        console.log(`✅ Saved: ${filename}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (verbose) {
        console.error(`❌ Failed: ${filename} - ${message}`)
      }
      stats.failed++
    }
  }

  if (verbose) {
    console.log('\n' + '='.repeat(50))
    console.log('📊 Download Summary:')
    console.log(`   Downloaded: ${stats.downloaded}`)
    console.log(`   Skipped: ${stats.skipped}`)
    console.log(`   Failed: ${stats.failed}`)
    console.log(`   Total articles: ${articles.length}`)
    console.log('='.repeat(50) + '\n')
  }

  return articles
}

/**
 * Merge freshly-fetched articles into the ones already on disk, keyed by guid.
 *
 * Medium's RSS only ever returns the latest 10 posts. Overwriting the file with
 * the feed therefore caps the archive at 10 forever and silently drops older
 * posts as new ones push them out — which is why the site could only ever show
 * 10 despite ~24 existing. Merging makes the file cumulative: the feed tops it
 * up, and entries added by hand or from a Medium export survive.
 *
 * Fresh data wins on conflict, except for `image`: a re-fetch that has not
 * downloaded the image yet must not blank an existing local path.
 */
/**
 * Every Medium URL for a post ends in the same 12-hex post id, but the prefix
 * differs by source:
 *
 *   RSS       guid: https://medium.com/p/ed7faec2a8b6
 *   export    canonical: https://medium.com/@jonakrusze/some-slug-ed7faec2a8b6
 *   published link: https://levelup.gitconnected.com/some-slug-ed7faec2a8b6
 *
 * Keying on the raw guid therefore treats the same article from two sources as
 * two articles. Key on the id.
 */
export function mediumPostId(article: MediumFlatData): string {
  const id = [article.guid, article.link]
    .map((url) => url?.match(/([0-9a-f]{8,16})(?:\?|#|$)/i)?.[1])
    .find(Boolean)

  return id ?? article.guid ?? article.link
}

export function mergeArticles(
  existing: MediumFlatData[],
  incoming: MediumFlatData[]
): MediumFlatData[] {
  const byId = new Map<string, MediumFlatData>()

  for (const article of existing) {
    byId.set(mediumPostId(article), article)
  }

  for (const article of incoming) {
    const id = mediumPostId(article)
    const previous = byId.get(id)

    byId.set(id, {
      ...previous,
      ...article,
      // A re-fetch that has not downloaded the image yet must not blank the
      // local path an earlier run already produced.
      image: article.image || previous?.image || '',
      // The RSS/publication link (levelup.gitconnected.com) is the URL readers
      // actually see; don't downgrade it to the bare profile canonical.
      link: previous?.link || article.link
    })
  }

  return [...byId.values()].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )
}

export function readExistingJson(dataPath: string): MediumFlatData[] {
  if (!fs.existsSync(dataPath)) return []

  try {
    const parsed = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    return Array.isArray(parsed) ? (parsed as MediumFlatData[]) : []
  } catch {
    return []
  }
}

/**
 * Save the filtered data to JSON file, merging with whatever is already there.
 */
export function saveDataJson(data: MediumFlatData[], dataPath: string): void {
  const merged = mergeArticles(readExistingJson(dataPath), data)
  fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2), 'utf8')
}

/**
 * Main execution
 */
export async function main(options: UpdateOptions = {}): Promise<void> {
  const silent = options.silent ?? false

  if (!silent) {
    console.log('\n📰 Medium Articles Updater\n' + '='.repeat(50) + '\n')
  }

  try {
    // Ensure images directory exists
    ensureImagesDir(IMAGES_DIR)

    // Step 1: Fetch data from Medium API
    if (!silent) {
      console.log('🌐 Fetching data from Medium RSS API...')
    }
    const fullData = await fetchMediumData(MEDIUM_API_URL, { silent })
    if (!silent) {
      console.log(`✅ Fetched ${fullData.items.length} articles from Medium\n`)
    }

    // Step 2: Filter to required fields
    if (!silent) {
      console.log('🔍 Filtering to required fields...')
    }
    const filteredData = filterMediumData(fullData)
    if (!silent) {
      console.log(`✅ Filtered ${filteredData.length} articles\n`)
    }

    // Step 3: Download images and update paths
    const dataWithLocalPaths = await downloadImages(
      filteredData,
      fullData,
      IMAGES_DIR,
      MAX_IMAGE_WIDTH,
      { silent }
    )

    // Step 4: Save to data JSON
    saveDataJson(dataWithLocalPaths, DATA_JSON)
    if (!silent) {
      console.log('✅ Updated mediumData.json with local image paths\n')
    }

    if (!silent) {
      console.log('🎉 Success! Medium articles updated.\n')
      console.log('Next steps:')
      console.log('  1. Review the changes')
      console.log('  2. Run: pnpm run build')
      console.log('  3. Commit and push\n')
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!silent) {
      console.error(`\n❌ Error: ${message}\n`)
    }

    process.exit(1)
  }
}

// Run if executed directly - use CI env var to control verbosity
if (require.main === module) {
  main({ silent: !!process.env.CI }).catch(console.error)
}
