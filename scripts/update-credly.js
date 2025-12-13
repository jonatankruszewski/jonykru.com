#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * All-in-one script to update Credly badges
 *
 * This script:
 * 1. Accepts a Credly API URL or curl command
 * 2. Fetches the badge data from Credly
 * 3. Filters to only required fields
 * 4. Downloads all badge images (200x200px)
 * 5. Updates credly.backup.json
 *
 * Usage:
 *   pnpm update-credly "https://www.credly.com/api/v1/users/USER_ID/badges?..."
 *
 * Or paste the full curl command:
 *   pnpm update-credly 'curl "https://www.credly.com/api/v1/..." -H "cookie: ..."'
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
 * Extract URL from curl command or return as-is if already a URL
 */
function extractUrl(input) {
  // Check if it's a curl command
  const curlMatch = input.match(/curl\s+["']([^"']+)["']/)
  if (curlMatch) {
    return curlMatch[1]
  }

  // Check if it's just a URL
  if (input.startsWith('http')) {
    return input
  }

  throw new Error(
    'Invalid input. Provide either a URL or a curl command from Credly.'
  )
}

/**
 * Fetch data from Credly API
 */
function fetchCredlyData(url) {
  try {
    console.log('🌐 Fetching data from Credly API...')
    const response = execSync(`curl -s "${url}"`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    })

    const data = JSON.parse(response)

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response from Credly API')
    }

    console.log(`✅ Fetched ${data.data.length} badges from Credly\n`)
    return data
  } catch (error) {
    throw new Error(`Failed to fetch from Credly: ${error.message}`)
  }
}

/**
 * Filter data to only required fields
 */
function filterCredlyData(fullData) {
  console.log('🔍 Filtering to required fields...')

  const filteredData = {
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

  console.log(`✅ Filtered ${filteredData.data.length} badges\n`)
  return filteredData
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
 */
function getFilenameFromUrl(url) {
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
function getResizedUrl(url) {
  const baseUrl = 'https://images.credly.com/'
  if (!url.startsWith(baseUrl)) return url
  return url.replace(baseUrl, `${baseUrl}size/200x200/`)
}

/**
 * Download all badge images
 */
async function downloadImages(data) {
  console.log('📥 Downloading badge images (200x200px)...\n')

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

  console.log('\n' + '='.repeat(50))
  console.log('📊 Download Summary:')
  console.log(`   Downloaded: ${downloaded}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Total badges: ${data.data.length}`)
  console.log('='.repeat(50) + '\n')

  return data
}

/**
 * Save the filtered data to JSON file
 */
function saveBackupJson(data) {
  fs.writeFileSync(BACKUP_JSON, JSON.stringify(data, null, 2), 'utf8')
  console.log('✅ Updated credly.backup.json with local image paths\n')
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🎖️  Credly Badge Updater\n' + '='.repeat(50) + '\n')

  // Get input from command line
  const input = process.argv[2]

  if (!input) {
    console.error('❌ Error: No input provided\n')
    console.log('Usage:')
    console.log('  pnpm update-credly "URL"')
    console.log('  pnpm update-credly \'curl "URL" -H "cookie: ..."\'\n')
    console.log('Example:')
    console.log(
      '  pnpm update-credly "https://www.credly.com/api/v1/users/USER_ID/badges?page=1&page_size=48&state=accepted%2Cpending"\n'
    )
    process.exit(1)
  }

  try {
    // Step 1: Extract URL
    const url = extractUrl(input)

    // Step 2: Fetch data from Credly
    const fullData = fetchCredlyData(url)

    // Step 3: Filter to required fields
    const filteredData = filterCredlyData(fullData)

    // Step 4: Download images and update paths
    const dataWithLocalPaths = await downloadImages(filteredData)

    // Step 5: Save to backup JSON
    saveBackupJson(dataWithLocalPaths)

    console.log('🎉 Success! Credly badges updated.\n')
    console.log('Next steps:')
    console.log('  1. Review the changes')
    console.log('  2. Run: pnpm run build')
    console.log('  3. Commit and push\n')
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`)
    process.exit(1)
  }
}

main().catch(console.error)
