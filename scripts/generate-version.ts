import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

interface PackageJson {
  version?: string
  [key: string]: unknown
}

interface VersionInfo {
  version: string
  timestamp: string
}

/**
 * Reads and validates package.json
 */
function readPackageJson(packageJsonPath: string): PackageJson {
  if (!existsSync(packageJsonPath)) {
    console.error('Error: package.json not found')
    process.exit(1)
  }

  try {
    return JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as PackageJson
  } catch (error) {
    console.error('Error: Failed to parse package.json:', error)
    process.exit(1)
  }
}

/**
 * Validates that version field exists in package.json
 */
function validateVersion(packageJson: PackageJson): string {
  if (!packageJson.version) {
    console.error('Error: version field not found in package.json')
    process.exit(1)
  }
  return packageJson.version
}

/**
 * Ensures the output directory exists
 */
function ensureOutputDirectory(outputPath: string): void {
  const outputDir = dirname(outputPath)
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }
}

/**
 * Writes version.json file
 */
function writeVersionFile(outputPath: string, versionInfo: VersionInfo): void {
  try {
    writeFileSync(
      outputPath,
      JSON.stringify(versionInfo, null, 2),
      'utf-8'
    )
    console.log(
      `✓ Generated version info: ${versionInfo.version} at ${versionInfo.timestamp}`
    )
  } catch (error) {
    console.error('Error: Failed to write version.json:', error)
    process.exit(1)
  }
}

/**
 * Main function to generate version.json
 */
function generateVersion(): void {
  try {
    const packageJsonPath = join(process.cwd(), 'package.json')
    const packageJson = readPackageJson(packageJsonPath)
    const version = validateVersion(packageJson)
    const timestamp = new Date().toISOString()

    const versionInfo: VersionInfo = {
      version,
      timestamp
    }

    const outputPath = join(process.cwd(), 'public', 'version.json')
    ensureOutputDirectory(outputPath)
    writeVersionFile(outputPath, versionInfo)
  } catch (error) {
    console.error('Unexpected error generating version info:', error)
    process.exit(1)
  }
}

// Execute if run directly
if (require.main === module) {
  generateVersion()
}

export {
  ensureOutputDirectory,
  generateVersion,
  readPackageJson,
  validateVersion,
  writeVersionFile
}
export type { PackageJson, VersionInfo }

