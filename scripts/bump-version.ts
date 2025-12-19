#!/usr/bin/env tsx

/**
 * Script to bump version manually
 * Usage:
 *   pnpm tsx scripts/bump-version.ts patch   - bump patch version (0.1.0 -> 0.1.1)
 *   pnpm tsx scripts/bump-version.ts minor   - bump minor version (0.1.0 -> 0.2.0)
 *   pnpm tsx scripts/bump-version.ts major   - bump major version (0.1.0 -> 1.0.0)
 *   pnpm tsx scripts/bump-version.ts         - defaults to patch
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

type VersionType = 'patch' | 'minor' | 'major'

interface PackageJson {
  version: string
  [key: string]: unknown
}

/**
 * Validates that the version type is one of the allowed values
 */
function validateVersionType(versionType: string): versionType is VersionType {
  return ['patch', 'minor', 'major'].includes(versionType)
}

/**
 * Gets the current version from package.json
 */
function getCurrentVersion(): string {
  const packageJsonPath = join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(
    readFileSync(packageJsonPath, 'utf-8')
  ) as PackageJson
  return packageJson.version
}

/**
 * Bumps the version using pnpm
 */
function bumpVersion(versionType: VersionType): string {
  try {
    execSync(`pnpm version ${versionType} --no-git-tag-version`, {
      stdio: 'inherit',
      cwd: process.cwd()
    })
    return getCurrentVersion()
  } catch (error) {
    console.error(`Failed to bump version: ${error}`)
    process.exit(1)
  }
}

/**
 * Stages package.json for commit
 */
function stagePackageJson(): void {
  try {
    execSync('git add package.json', {
      stdio: 'inherit',
      cwd: process.cwd()
    })
  } catch (error) {
    console.error(`Failed to stage package.json: ${error}`)
    process.exit(1)
  }
}

/**
 * Main function
 */
function main(): void {
  const versionType = (process.argv[2] || 'patch') as VersionType

  if (!validateVersionType(versionType)) {
    console.error("Error: Version type must be 'patch', 'minor', or 'major'")
    process.exit(1)
  }

  const currentVersion = getCurrentVersion()
  console.log(`Current version: ${currentVersion}`)

  const newVersion = bumpVersion(versionType)
  console.log(`Bumped version to: ${newVersion}`)

  stagePackageJson()

  console.log(`✓ Version bumped to ${newVersion}`)
  console.log('⚠ Remember to commit and tag:')
  console.log(`  git commit -m 'chore: bump version to ${newVersion}'`)
  console.log(`  git tag -a 'v${newVersion}' -m 'Release v${newVersion}'`)
}

if (require.main === module) {
  main()
}

export {
  bumpVersion,
  getCurrentVersion,
  main,
  stagePackageJson,
  validateVersionType
}
export type { VersionType }

