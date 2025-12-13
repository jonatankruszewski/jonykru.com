import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as fs from 'fs'
import {
  detectFileType,
  downloadAndResizeImage,
  downloadImages,
  ensureImagesDir,
  extractArticleId,
  extractImageUrl,
  fetchMediumData,
  filterMediumData,
  getFileExtension,
  type MediumApiResponse,
  type MediumArticle,
  type MediumFlatData,
  saveDataJson
} from './update-medium'

// Mock dependencies
vi.mock('fs')
vi.mock('child_process')

describe('update-medium', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('extractArticleId', () => {
    it('should extract article ID from guid URL', () => {
      const guid = 'https://medium.com/p/ed7faec2a8b6'
      const id = extractArticleId(guid)
      expect(id).toBe('ed7faec2a8b6')
    })

    it('should handle different guid formats', () => {
      const guid = 'https://medium.com/p/abc123xyz'
      const id = extractArticleId(guid)
      expect(id).toBe('abc123xyz')
    })
  })

  describe('getFileExtension', () => {
    it('should extract jpg extension', () => {
      const url = 'https://cdn-images-1.medium.com/max/1024/image.jpg'
      expect(getFileExtension(url)).toBe('jpg')
    })

    it('should extract png extension', () => {
      const url = 'https://cdn-images-1.medium.com/max/1024/image.png'
      expect(getFileExtension(url)).toBe('png')
    })

    it('should handle URLs with query parameters', () => {
      const url = 'https://cdn-images-1.medium.com/max/1024/image.jpeg?v=123'
      expect(getFileExtension(url)).toBe('jpeg')
    })

    it('should default to jpg for unknown extensions', () => {
      const url = 'https://cdn-images-1.medium.com/max/1024/image'
      expect(getFileExtension(url)).toBe('jpg')
    })

    it('should handle webp extension', () => {
      const url = 'https://cdn-images-1.medium.com/max/1024/image.webp'
      expect(getFileExtension(url)).toBe('webp')
    })
  })

  describe('extractImageUrl', () => {
    it('should extract image URL from content', () => {
      const article: MediumArticle = {
        title: 'Test',
        pubDate: '2024-01-01',
        link: 'https://medium.com',
        guid: 'https://medium.com/p/123',
        author: 'Test Author',
        thumbnail: '',
        description: '<p>Text</p>',
        content: '<img src="https://cdn-images-1.medium.com/max/1024/test.jpg">'
      }
      expect(extractImageUrl(article)).toBe(
        'https://cdn-images-1.medium.com/max/1024/test.jpg'
      )
    })

    it('should extract image URL from description if no content', () => {
      const article: MediumArticle = {
        title: 'Test',
        pubDate: '2024-01-01',
        link: 'https://medium.com',
        guid: 'https://medium.com/p/123',
        author: 'Test Author',
        thumbnail: '',
        description:
          '<img alt="alt text" src="https://cdn-images-1.medium.com/max/1024/desc.png">',
        content: ''
      }
      expect(extractImageUrl(article)).toBe(
        'https://cdn-images-1.medium.com/max/1024/desc.png'
      )
    })

    it('should fallback to thumbnail if no img tag', () => {
      const article: MediumArticle = {
        title: 'Test',
        pubDate: '2024-01-01',
        link: 'https://medium.com',
        guid: 'https://medium.com/p/123',
        author: 'Test Author',
        thumbnail: 'https://cdn-images-1.medium.com/thumbnail.jpg',
        description: '<p>No image here</p>',
        content: '<p>No image here either</p>'
      }
      expect(extractImageUrl(article)).toBe(
        'https://cdn-images-1.medium.com/thumbnail.jpg'
      )
    })

    it('should return null if no image found', () => {
      const article: MediumArticle = {
        title: 'Test',
        pubDate: '2024-01-01',
        link: 'https://medium.com',
        guid: 'https://medium.com/p/123',
        author: 'Test Author',
        thumbnail: '',
        description: '<p>No image</p>',
        content: '<p>No image</p>'
      }
      expect(extractImageUrl(article)).toBeNull()
    })

    it('should return null for empty thumbnail', () => {
      const article: MediumArticle = {
        title: 'Test',
        pubDate: '2024-01-01',
        link: 'https://medium.com',
        guid: 'https://medium.com/p/123',
        author: 'Test Author',
        thumbnail: '   ',
        description: '',
        content: ''
      }
      expect(extractImageUrl(article)).toBeNull()
    })
  })

  describe('filterMediumData', () => {
    it('should filter data to required fields', () => {
      const mockData: MediumApiResponse = {
        status: 'ok',
        feed: {
          url: 'https://medium.com/feed',
          title: 'Test Feed',
          link: 'https://medium.com',
          author: 'Author',
          description: 'Description',
          image: 'https://cdn.com/image.jpg'
        },
        items: [
          {
            title: 'Test Article',
            pubDate: '2024-01-15 10:30:00',
            link: 'https://medium.com/article-1',
            guid: 'https://medium.com/p/abc123',
            author: 'Test Author',
            thumbnail: '',
            description: '<p>Description</p>',
            content: '<p>Content</p>',
            categories: ['react', 'typescript']
          }
        ]
      }

      const filtered = filterMediumData(mockData)

      expect(filtered).toHaveLength(1)
      expect(filtered[0]).toEqual({
        title: 'Test Article',
        pubDate: '2024-01-15 10:30:00',
        guid: 'https://medium.com/p/abc123',
        link: 'https://medium.com/article-1',
        categories: ['react', 'typescript'],
        image: ''
      })
    })

    it('should handle articles without categories', () => {
      const mockData: MediumApiResponse = {
        status: 'ok',
        items: [
          {
            title: 'No Categories',
            pubDate: '2024-01-01',
            link: 'https://medium.com/article',
            guid: 'https://medium.com/p/xyz789',
            author: 'Author',
            thumbnail: '',
            description: '',
            content: ''
          }
        ]
      }

      const filtered = filterMediumData(mockData)

      expect(filtered[0].categories).toEqual([])
    })

    it('should handle multiple articles', () => {
      const mockData: MediumApiResponse = {
        status: 'ok',
        items: [
          {
            title: 'Article 1',
            pubDate: '2024-01-01',
            link: 'https://medium.com/1',
            guid: 'https://medium.com/p/1',
            author: 'Author',
            thumbnail: '',
            description: '',
            content: '',
            categories: ['cat1']
          },
          {
            title: 'Article 2',
            pubDate: '2024-01-02',
            link: 'https://medium.com/2',
            guid: 'https://medium.com/p/2',
            author: 'Author',
            thumbnail: '',
            description: '',
            content: '',
            categories: ['cat2']
          }
        ]
      }

      const filtered = filterMediumData(mockData)

      expect(filtered).toHaveLength(2)
      expect(filtered[0].title).toBe('Article 1')
      expect(filtered[1].title).toBe('Article 2')
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

  describe('saveDataJson', () => {
    it('should save data to JSON file', () => {
      const mockData: MediumFlatData[] = [
        {
          title: 'Test',
          pubDate: '2024-01-01',
          guid: 'https://medium.com/p/123',
          link: 'https://medium.com/article',
          categories: ['test'],
          image: '/images/medium/123.jpg'
        }
      ]

      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      saveDataJson(mockData, '/test/data.json')

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/test/data.json',
        JSON.stringify(mockData, null, 2),
        'utf8'
      )
    })
  })

  describe('fetchMediumData', () => {
    it('should fetch and parse Medium data', async () => {
      const mockResponse: MediumApiResponse = {
        status: 'ok',
        items: [
          {
            title: 'Test',
            pubDate: '2024-01-01',
            link: 'https://medium.com',
            guid: 'https://medium.com/p/123',
            author: 'Author',
            thumbnail: '',
            description: '',
            content: ''
          }
        ]
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const data = await fetchMediumData('https://api.rss2json.com/test', {
        silent: true
      })

      expect(data.items).toHaveLength(1)
      expect(data.status).toBe('ok')
    })

    it('should throw error if HTTP response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500
      })

      await expect(
        fetchMediumData('https://api.rss2json.com/test', { silent: true })
      ).rejects.toThrow('Failed to fetch from Medium')
    })

    it('should throw error if response status is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 'error', items: [] })
      })

      await expect(
        fetchMediumData('https://api.rss2json.com/test', { silent: true })
      ).rejects.toThrow('Invalid response from Medium API')
    })

    it('should throw error if items is not an array', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 'ok', items: 'not an array' })
      })

      await expect(
        fetchMediumData('https://api.rss2json.com/test', { silent: true })
      ).rejects.toThrow('Invalid response from Medium API')
    })

    it('should throw error if fetch fails', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(
        fetchMediumData('https://api.rss2json.com/test', { silent: true })
      ).rejects.toThrow('Failed to fetch from Medium: Network error')
    })
  })

  describe('detectFileType', () => {
    it('should detect JPEG files', () => {
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        jpegBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      expect(detectFileType('/test/image.jpg')).toBe('jpeg')
    })

    it('should detect PNG files', () => {
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        pngBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      expect(detectFileType('/test/image.png')).toBe('png')
    })

    it('should detect GIF files', () => {
      const gifBuffer = Buffer.from([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x00, 0x00
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        gifBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      expect(detectFileType('/test/image.gif')).toBe('gif')
    })

    it('should detect WebP files', () => {
      const webpBuffer = Buffer.from([
        0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        webpBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      expect(detectFileType('/test/image.webp')).toBe('webp')
    })

    it('should default to jpg for unknown types', () => {
      const unknownBuffer = Buffer.from([
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        unknownBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      expect(detectFileType('/test/image.unknown')).toBe('jpg')
    })

    it('should default to jpg on error', () => {
      vi.mocked(fs.openSync).mockImplementation(() => {
        throw new Error('File not found')
      })

      expect(detectFileType('/test/nonexistent.jpg')).toBe('jpg')
    })
  })

  describe('downloadAndResizeImage', () => {
    it('should download and resize image successfully', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('')
      vi.mocked(fs.statSync).mockReturnValue({ size: 1000 } as fs.Stats)
      vi.mocked(fs.existsSync).mockReturnValue(false)
      // Mock detectFileType to return jpeg
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        jpegBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      const result = downloadAndResizeImage(
        'https://test.com/image.jpg',
        '/tmp/image.jpeg',
        370
      )

      expect(result).toBe('/tmp/image.jpeg')
      expect(execSync).toHaveBeenCalled()
    })

    it('should throw error if downloaded file is empty', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('')
      vi.mocked(fs.statSync).mockReturnValue({ size: 0 } as fs.Stats)
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.unlinkSync).mockImplementation(() => undefined)

      expect(() =>
        downloadAndResizeImage(
          'https://test.com/image.jpg',
          '/tmp/image.jpg',
          370
        )
      ).toThrow('Downloaded file is empty')
    })

    it('should clean up files on error', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Download failed')
      })
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(fs.unlinkSync).mockImplementation(() => undefined)

      expect(() =>
        downloadAndResizeImage(
          'https://test.com/image.jpg',
          '/tmp/image.jpg',
          370
        )
      ).toThrow('Download failed')

      expect(fs.unlinkSync).toHaveBeenCalled()
    })

    it('should fallback to ImageMagick if sips fails', async () => {
      const { execSync } = await import('child_process')
      let callCount = 0
      vi.mocked(execSync).mockImplementation((_cmd: string) => {
        callCount++
        if (callCount === 1) {
          // curl download succeeds
          return ''
        }
        if (callCount === 2) {
          // sips fails
          throw new Error('sips not found')
        }
        // convert succeeds
        return ''
      })
      vi.mocked(fs.statSync).mockReturnValue({ size: 1000 } as fs.Stats)
      vi.mocked(fs.existsSync).mockReturnValue(false)
      // Mock detectFileType
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        jpegBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      const result = downloadAndResizeImage(
        'https://test.com/image.jpg',
        '/tmp/image.jpeg',
        370
      )

      expect(result).toBe('/tmp/image.jpeg')
    })

    it('should use original file if both sips and convert fail', async () => {
      const { execSync } = await import('child_process')
      let callCount = 0
      vi.mocked(execSync).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // curl download succeeds
          return ''
        }
        // sips and convert both fail
        throw new Error('resize failed')
      })
      vi.mocked(fs.statSync).mockReturnValue({ size: 1000 } as fs.Stats)
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.renameSync).mockImplementation(() => undefined)
      // Mock detectFileType
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        jpegBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      const result = downloadAndResizeImage(
        'https://test.com/image.jpg',
        '/tmp/image.jpeg',
        370
      )

      expect(result).toBe('/tmp/image.jpeg')
      expect(fs.renameSync).toHaveBeenCalled()
    })

    it('should rename file if detected type differs from extension', async () => {
      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('')
      vi.mocked(fs.statSync).mockReturnValue({ size: 1000 } as fs.Stats)
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.renameSync).mockImplementation(() => undefined)
      // Mock detectFileType to return png but file has .jpg extension
      const pngBuffer = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        pngBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      const result = downloadAndResizeImage(
        'https://test.com/image.jpg',
        '/tmp/image.jpg',
        370
      )

      expect(result).toBe('/tmp/image.png')
      expect(fs.renameSync).toHaveBeenCalledWith(
        '/tmp/image.jpg',
        '/tmp/image.png'
      )
    })
  })

  describe('downloadImages', () => {
    it('should download new images and skip existing ones', async () => {
      const articles: MediumFlatData[] = [
        {
          title: 'Article 1',
          pubDate: '2024-01-01',
          guid: 'https://medium.com/p/existing',
          link: 'https://medium.com/1',
          categories: [],
          image: ''
        },
        {
          title: 'Article 2',
          pubDate: '2024-01-02',
          guid: 'https://medium.com/p/new',
          link: 'https://medium.com/2',
          categories: [],
          image: ''
        }
      ]

      const fullData: MediumApiResponse = {
        status: 'ok',
        items: [
          {
            title: 'Article 1',
            pubDate: '2024-01-01',
            guid: 'https://medium.com/p/existing',
            link: 'https://medium.com/1',
            author: 'Author',
            thumbnail: '',
            description: '',
            content: '<img src="https://cdn.com/existing.jpg">'
          },
          {
            title: 'Article 2',
            pubDate: '2024-01-02',
            guid: 'https://medium.com/p/new',
            link: 'https://medium.com/2',
            author: 'Author',
            thumbnail: '',
            description: '',
            content: '<img src="https://cdn.com/new.jpg">'
          }
        ]
      }

      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('')
      vi.mocked(fs.statSync).mockReturnValue({ size: 1000 } as fs.Stats)

      // First image exists, second doesn't
      vi.mocked(fs.existsSync)
        .mockReturnValueOnce(true) // existing.jpg exists
        .mockReturnValueOnce(false) // new.jpg doesn't exist
        .mockReturnValueOnce(false) // temp file doesn't exist

      // Mock detectFileType to return jpeg
      const jpegBuffer = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x00, 0x00, 0x00
      ])
      vi.mocked(fs.openSync).mockReturnValue(1)
      vi.mocked(fs.readSync).mockImplementation((fd, buffer) => {
        jpegBuffer.copy(buffer as Buffer)
        return 8
      })
      vi.mocked(fs.closeSync).mockImplementation(() => undefined)

      const result = await downloadImages(
        articles,
        fullData,
        '/test/images',
        370,
        { silent: true }
      )

      expect(result[0].image).toBe('/images/medium/existing.jpg')
      expect(result[1].image).toBe('/images/medium/new.jpeg')
    })

    it('should handle articles without images gracefully', async () => {
      const articles: MediumFlatData[] = [
        {
          title: 'No Image Article',
          pubDate: '2024-01-01',
          guid: 'https://medium.com/p/noimg',
          link: 'https://medium.com/noimg',
          categories: [],
          image: ''
        }
      ]

      const fullData: MediumApiResponse = {
        status: 'ok',
        items: [
          {
            title: 'No Image Article',
            pubDate: '2024-01-01',
            guid: 'https://medium.com/p/noimg',
            link: 'https://medium.com/noimg',
            author: 'Author',
            thumbnail: '',
            description: '<p>No image here</p>',
            content: '<p>No image here</p>'
          }
        ]
      }

      const result = await downloadImages(
        articles,
        fullData,
        '/test/images',
        370,
        { silent: true }
      )

      expect(result[0].image).toBe('')
    })

    it('should handle download failures gracefully', async () => {
      const articles: MediumFlatData[] = [
        {
          title: 'Failed Download',
          pubDate: '2024-01-01',
          guid: 'https://medium.com/p/fail',
          link: 'https://medium.com/fail',
          categories: [],
          image: ''
        }
      ]

      const fullData: MediumApiResponse = {
        status: 'ok',
        items: [
          {
            title: 'Failed Download',
            pubDate: '2024-01-01',
            guid: 'https://medium.com/p/fail',
            link: 'https://medium.com/fail',
            author: 'Author',
            thumbnail: '',
            description: '',
            content: '<img src="https://cdn.com/fail.jpg">'
          }
        ]
      }

      const { execSync } = await import('child_process')
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Download failed')
      })

      const result = await downloadImages(
        articles,
        fullData,
        '/test/images',
        370,
        { silent: true }
      )

      expect(result[0].image).toBe('')
    })

    it('should handle missing original article', async () => {
      const articles: MediumFlatData[] = [
        {
          title: 'Missing Original',
          pubDate: '2024-01-01',
          guid: 'https://medium.com/p/missing',
          link: 'https://medium.com/missing',
          categories: [],
          image: ''
        }
      ]

      const fullData: MediumApiResponse = {
        status: 'ok',
        items: [] // No matching article
      }

      const result = await downloadImages(
        articles,
        fullData,
        '/test/images',
        370,
        { silent: true }
      )

      expect(result[0].image).toBe('')
    })
  })

  describe('main', () => {
    it('should execute full workflow successfully', async () => {
      const { main } = await import('./update-medium')

      const mockResponse: MediumApiResponse = {
        status: 'ok',
        items: [
          {
            title: 'Test Article',
            pubDate: '2024-01-01',
            guid: 'https://medium.com/p/test123',
            link: 'https://medium.com/test',
            author: 'Author',
            thumbnail: '',
            description: '',
            content: '<img src="https://cdn.com/test.jpg">',
            categories: ['test']
          }
        ]
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('')
      vi.mocked(fs.statSync).mockReturnValue({ size: 1000 } as fs.Stats)
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined)
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never)

      await main({ silent: true })

      expect(exitSpy).not.toHaveBeenCalled()
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1) // data only
    })

    it('should handle errors and exit with code 1', async () => {
      const { main } = await import('./update-medium')

      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never)

      await main({ silent: true })

      expect(exitSpy).toHaveBeenCalledWith(1)
    })

    it('should use CI environment variable when executed directly', async () => {
      const { main } = await import('./update-medium')
      const originalCI = process.env.CI

      process.env.CI = 'true'

      const mockResponse: MediumApiResponse = {
        status: 'ok',
        items: []
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const { execSync } = await import('child_process')
      vi.mocked(execSync).mockReturnValue('')
      vi.mocked(fs.existsSync).mockReturnValue(false)
      vi.mocked(fs.mkdirSync).mockImplementation(() => undefined)
      vi.mocked(fs.writeFileSync).mockImplementation(() => undefined)

      const consoleSpy = vi.spyOn(console, 'log')
      const exitSpy = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never)

      await main({ silent: !!process.env.CI })

      process.env.CI = originalCI

      expect(exitSpy).not.toHaveBeenCalled()
      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })
})
