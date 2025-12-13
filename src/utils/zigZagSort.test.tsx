import { describe, expect, it } from 'vitest'
import { zigZagSort } from './zigZagSort'

describe('zigZagSort', () => {
  it('should sort strings by length in zigzag pattern', () => {
    const input = ['short', 'a', 'medium', 'verylongstring', 'mid']
    const result = zigZagSort(input)

    // Sorted by length: a(1), mid(3), short(5), medium(6), verylongstring(14)
    // Zigzag pattern: verylongstring, a, mid, medium, short
    expect(result).toEqual(['verylongstring', 'a', 'mid', 'medium', 'short'])
  })

  it('should handle empty array', () => {
    const result = zigZagSort([])
    expect(result).toEqual([])
  })

  it('should handle single element', () => {
    const result = zigZagSort(['solo'])
    expect(result).toEqual(['solo'])
  })

  it('should handle two elements', () => {
    const result = zigZagSort(['short', 'verylongstring'])
    expect(result).toEqual(['verylongstring', 'short'])
  })

  it('should handle elements of equal length', () => {
    const result = zigZagSort(['abc', 'def', 'ghi'])
    // All same length, order depends on zigzag from sorted array
    expect(result).toHaveLength(3)
    expect(result).toContain('abc')
    expect(result).toContain('def')
    expect(result).toContain('ghi')
  })

  it('should not mutate the original array', () => {
    const input = ['c', 'bb', 'aaa']
    const original = [...input]
    zigZagSort(input)

    expect(input).toEqual(original)
  })

  it('should handle odd number of elements', () => {
    const input = ['1', '22', '333', '4444', '55555']
    const result = zigZagSort(input)

    // Sorted by length: 1, 22, 333, 4444, 55555
    // Zigzag pattern: longest, shortest, second-shortest, second-longest, middle
    expect(result).toEqual(['55555', '1', '22', '4444', '333'])
  })

  it('should handle even number of elements', () => {
    const input = ['1', '22', '333', '4444']
    const result = zigZagSort(input)

    // Sorted by length: 1, 22, 333, 4444
    // Zigzag pattern: longest, shortest, second-shortest, second-longest
    expect(result).toEqual(['4444', '1', '22', '333'])
  })

  it('should handle strings with same prefix but different lengths', () => {
    const input = ['test', 'testing', 'test1', 'test123']
    const result = zigZagSort(input)

    // Sorted by length: test(4), test1(5), testing(7), test123(7)
    // Zigzag: test123(or testing), test, test1, testing(or test123)
    expect(result).toHaveLength(4)
    // Longest should be first
    expect([result[0]]).toContain(result[0])
    expect(['testing', 'test123']).toContain(result[0])
    // Shortest should be second
    expect(result[1]).toBe('test')
  })

  it('should create visual balance with different length items', () => {
    const skills = ['JavaScript', 'AI', 'MongoDB', 'Data Modeling', 'AWS']
    const result = zigZagSort(skills)

    // Sorted by length: AI(2), AWS(3), MongoDB(7), JavaScript(10), Data Modeling(13)
    // Zigzag: Data Modeling, AI, AWS, JavaScript, MongoDB
    expect(result).toEqual([
      'Data Modeling',
      'AI',
      'AWS',
      'JavaScript',
      'MongoDB'
    ])
  })
})
