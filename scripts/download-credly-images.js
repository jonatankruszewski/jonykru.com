#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Script to download and resize Credly badge images
 *
 * This script:
 * 1. Reads credly.backup.json
 * 2. Downloads each badge image from Credly CDN (200x200 version)
 * 3. Saves them locally to public/images/badges/credly/
 * 4. Updates the JSON to reference local images
 *
 * Usage: node scripts/download-credly-images.js
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const BACKUP_JSON = path.join(
  __dirname,
  '..',
  'src',
  'dataFetchers',
  'credly.backup.json'
)
const IMAGES_DIR = path.join(
  __dirname,
  '..',
  'public',
  'images',
  'badges',
  'credly'
)

// Create images directory if it doesn't exist
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true })
}

/**
 * Download a file from a URL using curl
 */
function downloadFile(url, destPath) {
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
 * Uses the UUID from the URL to ensure uniqueness
 */
function getFilenameFromUrl(url) {
  // URL format: https://images.credly.com/images/16840ea3-5c9a-4599-853e-7e15bac7748e/MTA-Introduction_to_Programming_Using_JavaScript-600x600.png
  const parts = url.split('/')

  // Get the UUID (2nd to last part)
  const uuid = parts[parts.length - 2]

  // Get the original filename
  let filename = parts[parts.length - 1]

  // If filename is generic (image.png, blob, etc.), use UUID
  if (filename === 'image.png' || filename === 'blob' || filename.length < 5) {
    filename = `${uuid}.png`
  } else {
    // Replace size suffix (e.g., -600x600) with nothing for cleaner names
    filename = filename.replace(/-\d+x\d+/, '')
  }

  return filename
}

/**
 * Get the 200x200 version of the Credly image URL
 */
function getResizedUrl(url) {
  const baseUrl = 'https://images.credly.com/'
  if (!url.startsWith(baseUrl)) return url
  return url.replace(baseUrl, `${baseUrl}size/200x200/`)
}

async function main() {
  console.log('📥 Downloading Credly badge images...\n')

  // Read the JSON file
  const data = JSON.parse(fs.readFileSync(BACKUP_JSON, 'utf8'))

  let downloaded = 0
  let skipped = 0
  let failed = 0

  for (const badge of data.data) {
    const originalUrl = badge.image_url
    const resizedUrl = getResizedUrl(originalUrl)
    const filename = getFilenameFromUrl(originalUrl)
    const destPath = path.join(IMAGES_DIR, filename)
    const localUrl = `/images/badges/credly/${filename}`

    // Check if already downloaded
    if (fs.existsSync(destPath)) {
      console.log(`⏭️  Skip: ${filename} (already exists)`)
      badge.image_url = localUrl
      skipped++
      continue
    }

    try {
      console.log(`⬇️  Downloading: ${filename}...`)
      await downloadFile(resizedUrl, destPath)
      badge.image_url = localUrl
      downloaded++
      console.log(`✅ Saved: ${filename}`)
    } catch (error) {
      console.error(`❌ Failed: ${filename} - ${error.message}`)
      failed++
    }
  }

  // Update the JSON file with local paths
  fs.writeFileSync(BACKUP_JSON, JSON.stringify(data, null, 2), 'utf8')

  console.log('\n' + '='.repeat(50))
  console.log('📊 Summary:')
  console.log(`   Downloaded: ${downloaded}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Total badges: ${data.data.length}`)
  console.log('='.repeat(50))
  console.log('\n✅ Updated credly.backup.json with local image paths')
}

main().catch(console.error)
