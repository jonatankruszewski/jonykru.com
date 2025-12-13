import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as fs from 'fs'
import {
  type CredlyData,
  downloadFile,
  downloadImages,
  ensureImagesDir,
  fetchCredlyData,
  filterCredlyData,
  getFilenameFromUrl,
  getResizedUrl,
  readCurlFile,
  saveBackupJson
} from './credly-updater'

// Mock dependencies
vi.mock('fs')
vi.mock('child_process')

describe('credly-updater', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getFilenameFromUrl', () => {
    it('should extract filename from URL', () => {
      const url =
        'https://images.credly.com/images/uuid-1234/badge-name-600x600.png'
      const filename = getFilenameFromUrl(url)
      expect(filename).toBe('badge-name.png')
    })

    it('should use UUID for generic filenames', () => {
      const url = 'https://images.credly.com/images/uuid-1234/image.png'
      const filename = getFilenameFromUrl(url)
      expect(filename).toBe('uuid-1234.png')
    })

    it('should use UUID for blob filenames', () => {
      const url = 'https://images.credly.com/images/uuid-5678/blob'
      const filename = getFilenameFromUrl(url)
      expect(filename).toBe('uuid-5678.png')
    })

    it('should use UUID for short filenames', () => {
      const url = 'https://images.credly.com/images/uuid-9999/a.p'
      const filename = getFilenameFromUrl(url)
      expect(filename).toBe('uuid-9999.png')
    })

    it('should remove size suffix from filename', () => {
      const url =
        'https://images.credly.com/images/uuid-abc/badge-name-800x800.png'
      const filename = getFilenameFromUrl(url)
      expect(filename).toBe('badge-name.png')
    })
  })

  describe('getResizedUrl', () => {
    it('should add size parameter to Credly URL', () => {
      const url = 'https://images.credly.com/images/uuid/badge.png'
      const resized = getResizedUrl(url)
      expect(resized).toBe(
        'https://images.credly.com/size/200x200/images/uuid/badge.png'
      )
    })

    it('should return URL unchanged if not Credly', () => {
      const url = 'https://other.com/image.png'
      const resized = getResizedUrl(url)
      expect(resized).toBe(url)
    })
  })

  describe('filterCredlyData', () => {
    it('should filter data to required fields', () => {
      const mockData: CredlyData = {
        data: [
          {
            id: '123',
            badge_template: {
              name: 'Test Badge',
              skill_ids: [{ id: 's1', name: 'Skill 1' }],
              url: 'https://example.com',
              skills: []
            },
            image_url: 'https://image.com/badge.png',
            issuer_linked_in_name: 'Test Issuer',
            issuer: {
              entities: [
                {
                  entity: {
                    name: 'Test Entity'
                  }
                }
              ]
            }
          }
        ]
      }

      const filtered = filterCredlyData(mockData)

      expect(filtered.data).toHaveLength(1)
      expect(filtered.data[0]).toEqual({
        id: '123',
        badge_template: {
          name: 'Test Badge',
          skills: [{ id: 's1', name: 'Skill 1' }],
          url: 'https://example.com'
        },
        image_url: 'https://image.com/badge.png',
        issuer_linked_in_name: 'Test Issuer',
        issuer: {
          entities: [
            {
              entity: {
                name: 'Test Entity'
              }
            }
          ]
        }
      })
    })

    it('should handle badges without skill_ids', () => {
      const mockData: CredlyData = {
        data: [
          {
            id: '456',
            badge_template: {
              name: 'Test Badge 2',
              url: 'https://example.com',
              skills: []
            },
            image_url: 'https://image.com/badge2.png',
            issuer_linked_in_name: 'Test Issuer 2',
            issuer: {
              entities: [
                {
                  entity: {
                    name: 'Test Entity 2'
                  }
                }
              ]
            }
          }
        ]
      }

      const filtered = filterCredlyData(mockData)

      expect(filtered.data[0].badge_template.skills).toEqual([])
    })

    it('should handle multiple badges', () => {
      const mockData: CredlyData = {
        data: [
          {
            id: '1',
            badge_template: {
              name: 'Badge 1',
              skills: [],
              url: 'https://example.com'
            },
            image_url: 'https://image.com/1.png',
            issuer_linked_in_name: 'Issuer 1',
            issuer: {
              entities: [{ entity: { name: 'Entity 1' } }]
            }
          },
          {
            id: '2',
            badge_template: {
              name: 'Badge 2',
              skills: [],
              url: 'https://example.com'
            },
            image_url: 'https://image.com/2.png',
            issuer_linked_in_name: 'Issuer 2',
            issuer: {
              entities: [{ entity: { name: 'Entity 2' } }]
            }
          }
        ]
      }

      const filtered = filterCredlyData(mockData)

      expect(filtered.data).toHaveLength(2)
      expect(filtered.data[0].id).toBe('1')
      expect(filtered.data[1].id).toBe('2')
    })
  })

  describe('ensureImagesDir', () => {
    it('should create images directory if it does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined)

      ensureImagesDir('/test/dir')

      expect(fs.mkdirSync).toHaveBeenCalledWith('/test/dir', {
        recursive: true
      })
    })

    it('should not create directory if it already exists', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined)

      ensureImagesDir('/test/dir')

      expect(fs.mkdirSync).not.toHaveBeenCalled()
    })
  })

  describe('saveBackupJson', () => {
    it('should save data to JSON file', () => {
      const mockData: CredlyData = {
        data: [
          {
            id: '789',
            badge_template: {
              name: 'Save Test',
              skills: [],
              url: 'https://example.com'
            },
            image_url: '/local/image.png',
            issuer_linked_in_name: 'Issuer',
            issuer: {
              entities: [{ entity: { name: 'Entity' } }]
            }
          }
        ]
      }

      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      saveBackupJson(mockData, '/test/backup.json')

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/test/backup.json',
        JSON.stringify(mockData, null, 2),
        'utf8'
      )
    })
  })

  describe('readCurlFile', () => {
    it('should read curl command from file', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('curl "https://api.com"')

      const command = readCurlFile('/test/.credly-curl')

      expect(command).toBe('curl "https://api.com"')
      expect(fs.readFileSync).toHaveBeenCalledWith('/test/.credly-curl', 'utf8')
    })

    it('should throw error if file does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      expect(() => readCurlFile('/test/.credly-curl')).toThrow('File not found')
    })

    it('should throw error if file is empty', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('   ')

      expect(() => readCurlFile('/test/.credly-curl')).toThrow('File is empty')
    })

    it('should trim whitespace from curl command', () => {
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.readFileSync).mockReturnValue('  curl "https://api.com"  \n')

      const command = readCurlFile('/test/.credly-curl')

      expect(command).toBe('curl "https://api.com"')
    })
  })

  describe('fetchCredlyData', () => {
    it('should fetch and parse Credly data', async () => {
      const mockResponse = JSON.stringify({
        data: [
          {
            id: 'test-id',
            badge_template: {
              name: 'Test',
              skills: [],
              url: 'https://test.com'
            },
            image_url: 'https://test.com/image.png',
            issuer_linked_in_name: 'Test',
            issuer: {
              entities: [{ entity: { name: 'Test' } }]
            }
          }
        ]
      })

      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue(mockResponse)

      const data = fetchCredlyData('curl "https://api.credly.com"')

      expect(data.data).toHaveLength(1)
      expect(data.data[0].id).toBe('test-id')
    })

    it('should throw error if response is invalid JSON', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('not json')

      expect(() => fetchCredlyData('curl "https://api.credly.com"')).toThrow(
        'Failed to fetch from Credly'
      )
    })

    it('should throw error if response has no data array', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('{"invalid": "data"}')

      expect(() => fetchCredlyData('curl "https://api.credly.com"')).toThrow(
        'Invalid response from Credly API'
      )
    })

    it('should throw error if execSync fails', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Network error')
      })

      expect(() => fetchCredlyData('curl "https://api.credly.com"')).toThrow(
        'Failed to fetch from Credly: Network error'
      )
    })
  })

  describe('downloadFile', () => {
    it('should download file successfully', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('')
      vi.mocked(fs.statSync).mockReturnValue({ size: 1000 } as fs.Stats)

      const result = downloadFile(
        'https://test.com/image.png',
        '/tmp/image.png'
      )

      expect(result).toBe(true)
      expect(execSync).toHaveBeenCalled()
    })

    it('should throw error if downloaded file is empty', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('')
      vi.mocked(fs.statSync).mockReturnValue({ size: 0 } as fs.Stats)
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.unlinkSync).mockImplementation(() => undefined)

      expect(() =>
        downloadFile('https://test.com/image.png', '/tmp/image.png')
      ).toThrow('Downloaded file is empty')

      expect(fs.unlinkSync).toHaveBeenCalledWith('/tmp/image.png')
    })

    it('should delete file on download error', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Download failed')
      })
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.unlinkSync).mockImplementation(() => undefined)

      expect(() =>
        downloadFile('https://test.com/image.png', '/tmp/image.png')
      ).toThrow('Download failed')

      expect(fs.unlinkSync).toHaveBeenCalledWith('/tmp/image.png')
    })

    it('should not delete file if it does not exist after error', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Download failed')
      })
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.unlinkSync).mockImplementation(() => undefined)

      expect(() =>
        downloadFile('https://test.com/image.png', '/tmp/image.png')
      ).toThrow()

      expect(fs.unlinkSync).not.toHaveBeenCalled()
    })
  })

  describe('downloadImages', () => {
    it('should download new images and skip existing ones', async () => {
      const mockData: CredlyData = {
        data: [
          {
            id: '1',
            badge_template: {
              name: 'Badge 1',
              skills: [],
              url: 'https://test.com'
            },
            image_url:
              'https://images.credly.com/images/uuid1/badge1-600x600.png',
            issuer_linked_in_name: 'Test',
            issuer: { entities: [{ entity: { name: 'Test' } }] }
          },
          {
            id: '2',
            badge_template: {
              name: 'Badge 2',
              skills: [],
              url: 'https://test.com'
            },
            image_url:
              'https://images.credly.com/images/uuid2/badge2-600x600.png',
            issuer_linked_in_name: 'Test',
            issuer: { entities: [{ entity: { name: 'Test' } }] }
          }
        ]
      }

      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('')
      vi.mocked(fs.statSync).mockReturnValue({ size: 1000 } as fs.Stats)

      // First image exists, second doesn't
      vi.mocked(fs.existsSync)
        .mockReturnValueOnce(true) // badge1 exists
        .mockReturnValueOnce(false) // badge2 doesn't exist

      const result = await downloadImages(mockData, '/test/images', false)

      expect(result.data[0].image_url).toBe('/images/badges/credly/badge1.png')
      expect(result.data[1].image_url).toBe('/images/badges/credly/badge2.png')
    })

    it('should handle download failures gracefully', async () => {
      const mockData: CredlyData = {
        data: [
          {
            id: '3',
            badge_template: {
              name: 'Badge 3',
              skills: [],
              url: 'https://test.com'
            },
            image_url:
              'https://images.credly.com/images/uuid3/badge3-600x600.png',
            issuer_linked_in_name: 'Test',
            issuer: { entities: [{ entity: { name: 'Test' } }] }
          }
        ]
      }

      const { execSync } = await import('child_process')
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Download failed')
      })

      const result = await downloadImages(mockData, '/test/images', false)

      // Image URL should remain unchanged on failure
      expect(result.data[0].image_url).toBe(
        'https://images.credly.com/images/uuid3/badge3-600x600.png'
      )
    })

    it('should update all image URLs to local paths when skipped', async () => {
      const mockData: CredlyData = {
        data: [
          {
            id: '4',
            badge_template: {
              name: 'Badge 4',
              skills: [],
              url: 'https://test.com'
            },
            image_url:
              'https://images.credly.com/images/uuid4/existing-badge.png',
            issuer_linked_in_name: 'Test',
            issuer: { entities: [{ entity: { name: 'Test' } }] }
          }
        ]
      }

      vi.mocked(fs.existsSync).mockReturnValue(true) // File exists

      const result = await downloadImages(mockData, '/test/images', false)

      expect(result.data[0].image_url).toBe(
        '/images/badges/credly/existing-badge.png'
      )
    })
  })
})
