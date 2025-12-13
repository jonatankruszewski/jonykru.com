/**
 * Credly Badge Updater Library
 *
 * This module contains all the logic for updating Credly badges.
 * Separated from the CLI script for testability.
 */

import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

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
export function fetchCredlyData(curlCommand: string): CredlyData {
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
  verbose: boolean = true
): Promise<CredlyData> {
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
