import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import {
    ensureOutputDirectory,
    generateVersion,
    readPackageJson,
    validateVersion,
    writeVersionFile
} from './generate-version'

// Mock fs
vi.mock('fs', async () => {
    const actual = await vi.importActual<typeof import('fs')>('fs')
    return {
        ...actual,
        existsSync: vi.fn(),
        readFileSync: vi.fn(),
        writeFileSync: vi.fn(),
        mkdirSync: vi.fn()
    }
})

describe('generate-version', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('readPackageJson', () => {
        it('should exit if package.json does not exist', () => {
            vi.mocked(existsSync).mockReturnValue(false)
            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('exit')
            })

            expect(() => {
                readPackageJson(join(process.cwd(), 'package.json'))
            }).toThrow('exit')

            expect(exitSpy).toHaveBeenCalledWith(1)
        })

        it('should exit on invalid JSON', () => {
            vi.mocked(existsSync).mockReturnValue(true)
            vi.mocked(readFileSync).mockImplementation(() => {
                throw new Error('Invalid JSON')
            })
            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('exit')
            })

            expect(() => {
                readPackageJson(join(process.cwd(), 'package.json'))
            }).toThrow('exit')

            expect(exitSpy).toHaveBeenCalledWith(1)
        })

        it('should return parsed package.json', () => {
            const mockPackageJson = { version: '1.0.0', name: 'test' }
            vi.mocked(existsSync).mockReturnValue(true)
            vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockPackageJson))

            const result = readPackageJson(join(process.cwd(), 'package.json'))

            expect(result).toEqual(mockPackageJson)
        })
    })

    describe('validateVersion', () => {
        it('should exit if version field is missing', () => {
            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('exit')
            })

            expect(() => {
                validateVersion({ name: 'test' })
            }).toThrow('exit')

            expect(exitSpy).toHaveBeenCalledWith(1)
        })

        it('should return version if present', () => {
            const version = validateVersion({ version: '2.16.3' })
            expect(version).toBe('2.16.3')
        })
    })

    describe('ensureOutputDirectory', () => {
        it('should create directory if it does not exist', () => {
            const outputPath = join(process.cwd(), 'public', 'version.json')
            vi.mocked(existsSync).mockReturnValue(false)

            ensureOutputDirectory(outputPath)

            expect(mkdirSync).toHaveBeenCalledWith(join(process.cwd(), 'public'), {
                recursive: true
            })
        })

        it('should not create directory if it exists', () => {
            const outputPath = join(process.cwd(), 'public', 'version.json')
            vi.mocked(existsSync).mockReturnValue(true)

            ensureOutputDirectory(outputPath)

            expect(mkdirSync).not.toHaveBeenCalled()
        })
    })

    describe('writeVersionFile', () => {
        it('should write version.json successfully', () => {
            const outputPath = join(process.cwd(), 'public', 'version.json')
            const versionInfo = { version: '2.16.3', timestamp: '2024-01-01T00:00:00Z' }
            const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

            writeVersionFile(outputPath, versionInfo)

            expect(writeFileSync).toHaveBeenCalledWith(
                outputPath,
                JSON.stringify(versionInfo, null, 2),
                'utf-8'
            )
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('✓ Generated version info: 2.16.3')
            )
        })

        it('should exit on write error', () => {
            const outputPath = join(process.cwd(), 'public', 'version.json')
            const versionInfo = { version: '2.16.3', timestamp: '2024-01-01T00:00:00Z' }
            vi.mocked(writeFileSync).mockImplementation(() => {
                throw new Error('Write failed')
            })
            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('exit')
            })

            expect(() => {
                writeVersionFile(outputPath, versionInfo)
            }).toThrow('exit')

            expect(exitSpy).toHaveBeenCalledWith(1)
        })
    })

    describe('generateVersion', () => {
        it('should generate version.json successfully', () => {
            const mockPackageJson = { version: '2.16.3', name: 'test' }
            const packageJsonPath = join(process.cwd(), 'package.json')
            const publicDir = join(process.cwd(), 'public')

            vi.mocked(existsSync).mockImplementation((path) => {
                const pathStr = String(path)
                if (pathStr === packageJsonPath || pathStr.includes('package.json')) return true
                if (pathStr === publicDir || pathStr.includes('public')) return true
                return false
            })
            vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockPackageJson))
            vi.mocked(writeFileSync).mockReturnValue(undefined) // Don't throw
            const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { })
            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('exit')
            })

            expect(() => {
                generateVersion()
            }).not.toThrow()

            expect(writeFileSync).toHaveBeenCalled()
            expect(consoleLogSpy).toHaveBeenCalledWith(
                expect.stringContaining('✓ Generated version info: 2.16.3')
            )
            expect(exitSpy).not.toHaveBeenCalled()
        })

        it('should create public directory if missing', () => {
            const mockPackageJson = { version: '2.16.3', name: 'test' }
            const packageJsonPath = join(process.cwd(), 'package.json')
            const publicDir = join(process.cwd(), 'public')

            vi.mocked(existsSync).mockImplementation((path) => {
                const pathStr = String(path)
                if (pathStr === packageJsonPath || pathStr.includes('package.json')) return true
                if (pathStr === publicDir || pathStr.includes('public')) return false
                return false
            })
            vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockPackageJson))
            vi.mocked(writeFileSync).mockReturnValue(undefined) // Don't throw
            const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => { })
            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
                throw new Error('exit')
            })

            expect(() => {
                generateVersion()
            }).not.toThrow()

            expect(mkdirSync).toHaveBeenCalledWith(publicDir, { recursive: true })
            expect(writeFileSync).toHaveBeenCalled()
            expect(consoleLogSpy).toHaveBeenCalled()
            expect(exitSpy).not.toHaveBeenCalled()
        })
    })
})

