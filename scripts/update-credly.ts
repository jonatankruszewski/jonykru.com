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

import * as path from 'path'
import {
  downloadImages,
  ensureImagesDir,
  fetchCredlyData,
  filterCredlyData,
  readCurlFile,
  saveBackupJson
} from './lib/credly-updater'

const __dirname = path.resolve()

const CURL_FILE = path.join(__dirname, '.credly-curl')
const BACKUP_JSON = path.join(
  __dirname,
  'src',
  'dataFetchers',
  'credly.backup.json'
)
const IMAGES_DIR = path.join(__dirname, 'public', 'images', 'badges', 'credly')

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('\n🎖️  Credly Badge Updater\n' + '='.repeat(50) + '\n')

  try {
    // Ensure images directory exists
    ensureImagesDir(IMAGES_DIR)

    // Step 1: Read curl command from file
    console.log(`📄 Reading curl command from ${path.basename(CURL_FILE)}...`)
    const curlCommand = readCurlFile(CURL_FILE)
    console.log('✅ Curl command loaded\n')

    // Step 2: Fetch data from Credly using the curl command
    console.log('🌐 Fetching data from Credly API...')
    const fullData = fetchCredlyData(curlCommand)
    console.log(`✅ Fetched ${fullData.data.length} badges from Credly\n`)

    // Step 3: Filter to required fields
    console.log('🔍 Filtering to required fields...')
    const filteredData = filterCredlyData(fullData)
    console.log(`✅ Filtered ${filteredData.data.length} badges\n`)

    // Step 4: Download images and update paths
    const dataWithLocalPaths = await downloadImages(filteredData, IMAGES_DIR)

    // Step 5: Save to backup JSON
    saveBackupJson(dataWithLocalPaths, BACKUP_JSON)
    console.log('✅ Updated credly.backup.json with local image paths\n')

    console.log('🎉 Success! Credly badges updated.\n')
    console.log('Next steps:')
    console.log('  1. Review the changes')
    console.log('  2. Run: pnpm run build')
    console.log('  3. Commit and push\n')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`\n❌ Error: ${message}\n`)

    if (message.includes('File not found')) {
      console.log('Please create a .credly-curl file in the project root.')
      console.log(
        'Paste your curl command from the browser DevTools into this file.\n'
      )
    } else if (message.includes('File is empty')) {
      console.log('Please paste your curl command from the browser DevTools.\n')
      console.log('Steps:')
      console.log('  1. Open your browser DevTools (F12)')
      console.log('  2. Go to Network tab')
      console.log('  3. Visit your Credly badges page')
      console.log('  4. Find the API request')
      console.log('  5. Right-click → Copy → Copy as cURL')
      console.log(`  6. Paste into .credly-curl\n`)
    }

    process.exit(1)
  }
}

// Run if executed directly
main().catch(console.error)
