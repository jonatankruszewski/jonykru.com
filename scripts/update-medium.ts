#!/usr/bin/env node

/**
 * All-in-one script to update Medium articles
 *
 * This script:
 * 1. Fetches article data from Medium RSS feed via rss2json API
 * 2. Filters to only required fields
 * 3. Downloads article images (resized to 370px width)
 * 4. Saves to mediumData.json
 *
 * Usage:
 *   Run: pnpm update-medium
 */

import { execSync } from 'child_process'
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
 * Get file extension from URL or default to jpg
 */
export function getFileExtension(url: string): string {
  const match = url.match(/\.([a-zA-Z]+)(?:\?|$)/)
  if (
    match &&
    ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(match[1].toLowerCase())
  ) {
    return match[1].toLowerCase()
  }
  return 'jpg'
}

/**
 * Detect actual file type from file content using magic bytes
 */
export function detectFileType(filePath: string): string {
  try {
    const fd = fs.openSync(filePath, 'r')
    const buffer = Buffer.alloc(8)
    fs.readSync(fd, buffer, 0, 8, 0)
    fs.closeSync(fd)

    // Check magic bytes
    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'jpeg'
    }
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return 'png'
    }
    // GIF: 47 49 46 38
    if (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38
    ) {
      return 'gif'
    }
    // WebP: 52 49 46 46 ... 57 45 42 50
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46
    ) {
      return 'webp'
    }

    return 'jpg' // Default
  } catch {
    return 'jpg'
  }
}

/**
 * Download and resize an image, returns the actual file path (may differ from destPath if extension changed)
 */
export function downloadAndResizeImage(
  url: string,
  destPath: string,
  maxWidth: number
): string {
  try {
    // Create a temp file for the original
    const tempPath = `${destPath}.tmp`

    // Download the image using curl
    execSync(`curl -s -L -o "${tempPath}" "${url}"`, { stdio: 'pipe' })

    // Check if file was downloaded and has content
    const stats = fs.statSync(tempPath)
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty')
    }

    // Resize using sips (macOS) or ImageMagick (Linux)
    try {
      // Try sips first (macOS)
      execSync(
        `sips --resampleWidth ${maxWidth} "${tempPath}" --out "${destPath}" 2>/dev/null`,
        { stdio: 'pipe' }
      )
    } catch {
      // Fallback to ImageMagick convert
      try {
        execSync(
          `convert "${tempPath}" -resize ${maxWidth}x "${destPath}" 2>/dev/null`,
          { stdio: 'pipe' }
        )
      } catch {
        // If neither works, just use the original
        fs.renameSync(tempPath, destPath)
      }
    }

    // Clean up temp file if it still exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath)
    }

    // Detect actual file type and rename if necessary
    const actualType = detectFileType(destPath)
    const currentExt = path.extname(destPath).slice(1).toLowerCase()

    if (
      (actualType !== currentExt && actualType !== 'jpg') ||
      (actualType === 'jpg' && currentExt !== 'jpg' && currentExt !== 'jpeg')
    ) {
      const newExt = actualType === 'jpg' ? 'jpeg' : actualType
      const newPath = destPath.replace(/\.[^.]+$/, `.${newExt}`)
      fs.renameSync(destPath, newPath)
      return newPath
    }

    return destPath
  } catch (error) {
    // Delete failed download
    const tempPath = `${destPath}.tmp`
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath)
    }
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath)
    }
    throw error
  }
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
 * Download all article images
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
    console.log(`📥 Downloading article images (max ${maxWidth}px width)...\n`)
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
    const extension = getFileExtension(imageUrl)
    const filename = `${articleId}.${extension}`
    const destPath = path.join(imagesDir, filename)
    const localUrl = `/images/medium/${filename}`

    // Check if already downloaded
    if (fs.existsSync(destPath)) {
      if (verbose) {
        console.log(`⏭️  Skip: ${filename} (already exists)`)
      }
      article.image = localUrl
      stats.skipped++
      continue
    }

    try {
      if (verbose) {
        console.log(`⬇️  Downloading: ${filename}...`)
      }
      const actualPath = downloadAndResizeImage(imageUrl, destPath, maxWidth)
      const actualFilename = path.basename(actualPath)
      article.image = `/images/medium/${actualFilename}`
      stats.downloaded++
      if (verbose) {
        console.log(`✅ Saved: ${actualFilename}`)
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
 * Save the filtered data to JSON file
 */
export function saveDataJson(data: MediumFlatData[], dataPath: string): void {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8')
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
