#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Script to update Credly badges
 *
 * Usage:
 * 1. Manually fetch your badges from Credly:
 *    curl "https://www.credly.com/users/jonatan-kruszewski/badges?page=1&page_size=48&sort=rank" \
 *      -H "accept: application/json" > temp-credly-full.json
 *
 * 2. Run this script:
 *    node scripts/update-credly-badges.js temp-credly-full.json
 *
 * 3. Rebuild your site:
 *    pnpm run build
 */

const fs = require('fs')
const path = require('path')

const inputFile = process.argv[2] || 'temp-credly-full.json'

if (!fs.existsSync(inputFile)) {
  console.error(`Error: File '${inputFile}' not found.`)
  console.error('\nFirst, fetch your Credly data:')
  console.error(
    'curl "https://www.credly.com/users/jonatan-kruszewski/badges?page=1&page_size=48&sort=rank" \\'
  )
  console.error('  -H "accept: application/json" > temp-credly-full.json')
  console.error(
    '\nThen run: node scripts/update-credly-badges.js temp-credly-full.json'
  )
  process.exit(1)
}

try {
  // Read the full credly data
  const fullData = JSON.parse(fs.readFileSync(inputFile, 'utf8'))

  // Filter to only the fields needed based on CredlyBadge type
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

  // Write the filtered data
  const outputPath = path.join(
    __dirname,
    '..',
    'src',
    'dataFetchers',
    'credly.backup.json'
  )
  fs.writeFileSync(outputPath, JSON.stringify(filteredData, null, 2), 'utf8')

  console.log(`✓ Filtered ${filteredData.data.length} badges`)
  console.log(`✓ Saved to ${outputPath}`)
  console.log('\nNext steps:')
  console.log('1. Review the updated badges')
  console.log('2. Run: pnpm run build')
  console.log('3. Commit and push the changes')
} catch (error) {
  console.error('Error processing Credly data:', error.message)
  process.exit(1)
}
