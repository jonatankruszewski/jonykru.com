import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import {
  bumpVersion,
  getCurrentVersion,
  main,
  stagePackageJson,
  validateVersionType
} from './bump-version'

// Mock child_process
vi.mock('child_process', () => ({
  execSync: vi.fn()
}))

// Mock fs
vi.mock('fs', () => ({
  readFileSync: vi.fn()
}))

describe('bump-version', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('validateVersionType', () => {
    it('should validate patch version type', () => {
      expect(validateVersionType('patch')).toBe(true)
    })

    it('should validate minor version type', () => {
      expect(validateVersionType('minor')).toBe(true)
    })

    it('should validate major version type', () => {
      expect(validateVersionType('major')).toBe(true)
    })

    it('should reject invalid version types', () => {
      expect(validateVersionType('invalid')).toBe(false)
      expect(validateVersionType('')).toBe(false)
      expect(validateVersionType('patchy')).toBe(false)
    })
  })

  describe('getCurrentVersion', () => {
    it('should read version from package.json', () => {
      const mockPackageJson = { version: '2.16.3', name: 'test' }
      vi.mocked(readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson)
      )

      const version = getCurrentVersion()

      expect(version).toBe('2.16.3')
      expect(readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('package.json'),
        'utf-8'
      )
    })

    it('should handle different version formats', () => {
      const mockPackageJson = { version: '1.0.0', name: 'test' }
      vi.mocked(readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson)
      )

      const version = getCurrentVersion()
      expect(version).toBe('1.0.0')
    })
  })

  describe('bumpVersion', () => {
    it('should call pnpm version patch', () => {
      const mockPackageJson = { version: '2.16.4', name: 'test' }
      vi.mocked(readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson)
      )
      vi.mocked(execSync).mockReturnValue(Buffer.from(''))

      const newVersion = bumpVersion('patch')

      expect(execSync).toHaveBeenCalledWith(
        'pnpm version patch --no-git-tag-version',
        expect.objectContaining({
          stdio: 'inherit',
          cwd: expect.any(String)
        })
      )
      expect(newVersion).toBe('2.16.4')
    })

    it('should call pnpm version minor', () => {
      const mockPackageJson = { version: '2.17.0', name: 'test' }
      vi.mocked(readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson)
      )
      vi.mocked(execSync).mockReturnValue(Buffer.from(''))

      const newVersion = bumpVersion('minor')

      expect(execSync).toHaveBeenCalledWith(
        'pnpm version minor --no-git-tag-version',
        expect.any(Object)
      )
      expect(newVersion).toBe('2.17.0')
    })

    it('should call pnpm version major', () => {
      const mockPackageJson = { version: '3.0.0', name: 'test' }
      vi.mocked(readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson)
      )
      vi.mocked(execSync).mockReturnValue(Buffer.from(''))

      const newVersion = bumpVersion('major')

      expect(execSync).toHaveBeenCalledWith(
        'pnpm version major --no-git-tag-version',
        expect.any(Object)
      )
      expect(newVersion).toBe('3.0.0')
    })

    it('should exit on error', () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('exit')
      })
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('pnpm failed')
      })

      expect(() => bumpVersion('patch')).toThrow('exit')
      expect(exitSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('stagePackageJson', () => {
    it('should stage package.json with git add', () => {
      vi.mocked(execSync).mockReturnValue(Buffer.from(''))

      stagePackageJson()

      expect(execSync).toHaveBeenCalledWith(
        'git add package.json',
        expect.objectContaining({
          stdio: 'inherit',
          cwd: expect.any(String)
        })
      )
    })

    it('should exit on error when staging fails', () => {
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('exit')
      })
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('git add failed')
      })

      expect(() => stagePackageJson()).toThrow('exit')
      expect(exitSpy).toHaveBeenCalledWith(1)
    })
  })

  describe('main', () => {
    let consoleLogSpy: ReturnType<typeof vi.spyOn>
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>
    let exitSpy: ReturnType<typeof vi.spyOn>
    let originalArgv: string[]

    beforeEach(() => {
      consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { })
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
      exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('exit')
      })
      originalArgv = process.argv
    })

    afterEach(() => {
      process.argv = originalArgv
      vi.restoreAllMocks()
    })

    it('should bump version with patch when no argument provided', () => {
      process.argv = ['node', 'bump-version.ts']
      const mockPackageJsonBefore = { version: '2.16.3', name: 'test' }
      const mockPackageJsonAfter = { version: '2.16.4', name: 'test' }
      vi.mocked(readFileSync)
        .mockReturnValueOnce(JSON.stringify(mockPackageJsonBefore))
        .mockReturnValueOnce(JSON.stringify(mockPackageJsonAfter))
      vi.mocked(execSync).mockReturnValue(Buffer.from(''))

      main()

      expect(execSync).toHaveBeenCalledWith(
        'pnpm version patch --no-git-tag-version',
        expect.any(Object)
      )
      expect(execSync).toHaveBeenCalledWith(
        'git add package.json',
        expect.any(Object)
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Current version: 2.16.3'
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Bumped version to: 2.16.4'
      )
    })

    it('should bump version with provided type', () => {
      process.argv = ['node', 'bump-version.ts', 'minor']
      const mockPackageJsonBefore = { version: '2.16.3', name: 'test' }
      const mockPackageJsonAfter = { version: '2.17.0', name: 'test' }
      vi.mocked(readFileSync)
        .mockReturnValueOnce(JSON.stringify(mockPackageJsonBefore))
        .mockReturnValueOnce(JSON.stringify(mockPackageJsonAfter))
      vi.mocked(execSync).mockReturnValue(Buffer.from(''))

      main()

      expect(execSync).toHaveBeenCalledWith(
        'pnpm version minor --no-git-tag-version',
        expect.any(Object)
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('✓ Version bumped to 2.17.0')
      )
    })

    it('should exit with error for invalid version type', () => {
      process.argv = ['node', 'bump-version.ts', 'invalid']

      expect(() => main()).toThrow('exit')
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error: Version type must be 'patch', 'minor', or 'major'"
      )
      expect(exitSpy).toHaveBeenCalledWith(1)
    })

    it('should display commit and tag instructions', () => {
      process.argv = ['node', 'bump-version.ts', 'major']
      const mockPackageJsonBefore = { version: '2.16.3', name: 'test' }
      const mockPackageJsonAfter = { version: '3.0.0', name: 'test' }
      vi.mocked(readFileSync)
        .mockReturnValueOnce(JSON.stringify(mockPackageJsonBefore))
        .mockReturnValueOnce(JSON.stringify(mockPackageJsonAfter))
      vi.mocked(execSync).mockReturnValue(Buffer.from(''))

      main()

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '⚠ Remember to commit and tag:'
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "  git commit -m 'chore: bump version to 3.0.0'"
      )
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "  git tag -a 'v3.0.0' -m 'Release v3.0.0'"
      )
    })

    it('should handle error in bumpVersion during main execution', () => {
      process.argv = ['node', 'bump-version.ts', 'patch']
      const mockPackageJson = { version: '2.16.3', name: 'test' }
      vi.mocked(readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson)
      )
      vi.mocked(execSync).mockImplementation((command: string) => {
        if (command.includes('pnpm version')) {
          throw new Error('pnpm failed')
        }
        return Buffer.from('')
      })

      expect(() => main()).toThrow('exit')
      expect(exitSpy).toHaveBeenCalledWith(1)
    })
  })
})

