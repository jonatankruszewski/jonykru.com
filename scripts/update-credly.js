#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

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

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const CURL_FILE = path.join(__dirname, '..', '.credly-curl')
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
 * Fetch data from Credly API using the full curl command
 */
function fetchCredlyData(curlCommand) {
  try {
    console.log('🌐 Fetching data from Credly API...')

    // Execute the curl command directly (it already has auth cookies)
    const response = execSync(curlCommand, {
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
 * Read curl command from file
 */
function readCurlFile() {
  // Check if file exists
  if (!fs.existsSync(CURL_FILE)) {
    console.error(`❌ Error: File not found: ${CURL_FILE}\n`)
    console.log('Please create a .credly-curl file in the project root.')
    console.log(
      'Paste your curl command from the browser DevTools into this file.\n'
    )
    console.log('Example:')
    console.log(
      '  curl "https://www.credly.com/api/v1/users/USER_ID/badges?..." -H "cookie: ..."\n'
    )
    process.exit(1)
  }

  // Read file content
  const curlCommand = fs.readFileSync(CURL_FILE, 'utf8').trim()

  // Check if file is empty
  if (!curlCommand || curlCommand.length === 0) {
    console.error(`❌ Error: File is empty: ${CURL_FILE}\n`)
    console.log('Please paste your curl command from the browser DevTools.\n')
    console.log('Steps:')
    console.log('  1. Open your browser DevTools (F12)')
    console.log('  2. Go to Network tab')
    console.log('  3. Visit your Credly badges page')
    console.log('  4. Find the API request')
    console.log('  5. Right-click → Copy → Copy as cURL')
    console.log(`  6. Paste into ${CURL_FILE}\n`)
    process.exit(1)
  }

  return curlCommand
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🎖️  Credly Badge Updater\n' + '='.repeat(50) + '\n')

  try {
    // Step 1: Read curl command from file
    console.log(`📄 Reading curl command from ${path.basename(CURL_FILE)}...`)
    const curlCommand = readCurlFile()
    console.log('✅ Curl command loaded\n')

    // Step 2: Fetch data from Credly using the curl command
    const fullData = fetchCredlyData(curlCommand)

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
