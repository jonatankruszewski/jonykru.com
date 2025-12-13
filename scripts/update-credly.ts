#!/usr/bin/env node

/**
 * All-in-one script to update Credly badges
 *
 * This script:
 * 1. Reads curl command from .credly-curl file
 * 2. Fetches the badge data from Credly
 * 3. Filters to only required fields
 * 4. Downloads all badge images (200x200px)
 * 5. Updates credly.backup.json
 *
 * Usage:
 *   1. Paste your curl command in .credly-curl file (in project root)
 *   2. Run: pnpm update-credly
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const __dirname = path.resolve()

export const CURL_FILE = path.join(__dirname, '.credly-curl')
export const BACKUP_JSON = path.join(
  __dirname,
  'src',
  'dataFetchers',
  'credly.backup.json'
)
export const IMAGES_DIR = path.join(
  __dirname,
  'public',
  'images',
  'badges',
  'credly'
)

export interface CredlySkill {
  id: string
  name: string
}

export interface CredlyBadgeTemplate {
  name: string
  skills: CredlySkill[]
  url: string
  skill_ids?: CredlySkill[]
}

export interface CredlyEntity {
  entity: {
    name: string
  }
}

export interface CredlyIssuer {
  entities: CredlyEntity[]
}

export interface CredlyBadge {
  id: string
  badge_template: CredlyBadgeTemplate
  image_url: string
  issuer_linked_in_name: string
  issuer: CredlyIssuer
}

export interface CredlyData {
  data: CredlyBadge[]
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
 * Fetch data from Credly API using the full curl command
 */
export function fetchCredlyData(
  curlCommand: string,
  options: UpdateOptions = {}
): CredlyData {
  try {
    // Execute the curl command directly (it already has auth cookies)
    const response = execSync(curlCommand, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    })

    const data = JSON.parse(response) as CredlyData

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response from Credly API')
    }

    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to fetch from Credly: ${message}`)
  }
}

/**
 * Filter data to only required fields
 */
export function filterCredlyData(fullData: CredlyData): CredlyData {
  const filteredData: CredlyData = {
    data: fullData.data.map((badge) => ({
      id: badge.id,
      badge_template: {
        name: badge.badge_template.name,
        skills:
          badge.badge_template.skill_ids?.map((skill) => ({
            id: skill.id,
            name: skill.name
          })) || [],
        url: badge.badge_template.url
      },
      image_url: badge.image_url,
      issuer_linked_in_name: badge.issuer_linked_in_name,
      issuer: {
        entities: badge.issuer.entities.map((entity) => ({
          entity: {
            name: entity.entity.name
          }
        }))
      }
    }))
  }

  return filteredData
}

/**
 * Download a file from a URL using curl
 */
export function downloadFile(url: string, destPath: string): boolean {
  try {
    execSync(`curl -s -L -o "${destPath}" "${url}"`, { stdio: 'pipe' })

    // Check if file was downloaded and has content
    const stats = fs.statSync(destPath)
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty')
    }

    return true
  } catch (error) {
    // Delete failed download
    if (fs.existsSync(destPath)) {
      fs.unlinkSync(destPath)
    }
    throw error
  }
}

/**
 * Extract unique filename from Credly URL
 */
export function getFilenameFromUrl(url: string): string {
  const parts = url.split('/')
  const uuid = parts[parts.length - 2]
  let filename = parts[parts.length - 1]

  // If filename is generic, use UUID
  if (filename === 'image.png' || filename === 'blob' || filename.length < 5) {
    filename = `${uuid}.png`
  } else {
    // Remove size suffix for cleaner names
    filename = filename.replace(/-\d+x\d+/, '')
  }

  return filename
}

/**
 * Get the 200x200 version of the Credly image URL
 */
export function getResizedUrl(url: string): string {
  const baseUrl = 'https://images.credly.com/'
  if (!url.startsWith(baseUrl)) return url
  return url.replace(baseUrl, `${baseUrl}size/200x200/`)
}

/**
 * Download all badge images
 */
export async function downloadImages(
  data: CredlyData,
  imagesDir: string,
  options: UpdateOptions = {}
): Promise<CredlyData> {
  const verbose = !options.silent
  if (verbose) {
    console.log('📥 Downloading badge images (200x200px)...\n')
  }

  const stats: DownloadStats = {
    downloaded: 0,
    skipped: 0,
    failed: 0
  }

  for (const badge of data.data) {
    const originalUrl = badge.image_url
    const resizedUrl = getResizedUrl(originalUrl)
    const filename = getFilenameFromUrl(originalUrl)
    const destPath = path.join(imagesDir, filename)
    const localUrl = `/images/badges/credly/${filename}`

    // Check if already downloaded
    if (fs.existsSync(destPath)) {
      if (verbose) {
        console.log(`⏭️  Skip: ${filename} (already exists)`)
      }
      badge.image_url = localUrl
      stats.skipped++
      continue
    }

    try {
      if (verbose) {
        console.log(`⬇️  Downloading: ${filename}...`)
      }
      await downloadFile(resizedUrl, destPath)
      badge.image_url = localUrl
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
    console.log(`   Total badges: ${data.data.length}`)
    console.log('='.repeat(50) + '\n')
  }

  return data
}

/**
 * Save the filtered data to JSON file
 */
export function saveBackupJson(data: CredlyData, backupPath: string): void {
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8')
}

/**
 * Read curl command from file
 */
export function readCurlFile(curlFilePath: string): string {
  // Check if file exists
  if (!fs.existsSync(curlFilePath)) {
    throw new Error(`File not found: ${curlFilePath}`)
  }

  // Read file content
  const curlCommand = fs.readFileSync(curlFilePath, 'utf8').trim()

  // Check if file is empty
  if (!curlCommand || curlCommand.length === 0) {
    throw new Error(`File is empty: ${curlFilePath}`)
  }

  return curlCommand
}

/**
 * Main execution
 */
export async function main(options: UpdateOptions = {}): Promise<void> {
  const silent = options.silent ?? false

  if (!silent) {
    console.log('\n🎖️  Credly Badge Updater\n' + '='.repeat(50) + '\n')
  }

  try {
    // Ensure images directory exists
    ensureImagesDir(IMAGES_DIR)

    // Step 1: Read curl command from file
    if (!silent) {
      console.log(`📄 Reading curl command from ${path.basename(CURL_FILE)}...`)
    }
    const curlCommand = readCurlFile(CURL_FILE)
    if (!silent) {
      console.log('✅ Curl command loaded\n')
    }

    // Step 2: Fetch data from Credly using the curl command
    if (!silent) {
      console.log('🌐 Fetching data from Credly API...')
    }
    const fullData = fetchCredlyData(curlCommand, { silent })
    if (!silent) {
      console.log(`✅ Fetched ${fullData.data.length} badges from Credly\n`)
    }

    // Step 3: Filter to required fields
    if (!silent) {
      console.log('🔍 Filtering to required fields...')
    }
    const filteredData = filterCredlyData(fullData)
    if (!silent) {
      console.log(`✅ Filtered ${filteredData.data.length} badges\n`)
    }

    // Step 4: Download images and update paths
    const dataWithLocalPaths = await downloadImages(filteredData, IMAGES_DIR, {
      silent
    })

    // Step 5: Save to backup JSON
    saveBackupJson(dataWithLocalPaths, BACKUP_JSON)
    if (!silent) {
      console.log('✅ Updated credly.backup.json with local image paths\n')
    }

    if (!silent) {
      console.log('🎉 Success! Credly badges updated.\n')
      console.log('Next steps:')
      console.log('  1. Review the changes')
      console.log('  2. Run: pnpm run build')
      console.log('  3. Commit and push\n')
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (!silent) {
      console.error(`\n❌ Error: ${message}\n`)

      if (message.includes('File not found')) {
        console.log('Please create a .credly-curl file in the project root.')
        console.log(
          'Paste your curl command from the browser DevTools into this file.\n'
        )
      } else if (message.includes('File is empty')) {
        console.log(
          'Please paste your curl command from the browser DevTools.\n'
        )
        console.log('Steps:')
        console.log('  1. Open your browser DevTools (F12)')
        console.log('  2. Go to Network tab')
        console.log('  3. Visit your Credly badges page')
        console.log('  4. Find the API request')
        console.log('  5. Right-click → Copy → Copy as cURL')
        console.log(`  6. Paste into .credly-curl\n`)
      }
    }

    process.exit(1)
  }
}

// Run if executed directly - use CI env var to control verbosity
if (require.main === module) {
  main({ silent: !!process.env.CI }).catch(console.error)
}
