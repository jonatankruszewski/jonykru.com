import { describe, expect, it, vi } from 'vitest'
import { collectStars, fetchStars } from './update-oss'

const okResponse = (stars: number) =>
  ({ ok: true, json: async () => ({ stargazers_count: stars }) }) as Response

const errorResponse = (status: number) => ({ ok: false, status }) as Response

describe('fetchStars', () => {
  it('returns the star count for a repo', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(281))
    await expect(fetchStars('dcouple/Pane', fetchImpl)).resolves.toBe(281)
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.github.com/repos/dcouple/Pane',
      expect.anything()
    )
  })

  it('returns null on a failed request so the previous count survives', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fetchImpl = vi.fn().mockResolvedValue(errorResponse(404))
    await expect(fetchStars('nobody/nothing', fetchImpl)).resolves.toBeNull()
  })

  it('returns null when the payload has no star count', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({}) } as Response)
    await expect(fetchStars('a/b', fetchImpl)).resolves.toBeNull()
  })
})

describe('collectStars', () => {
  it('maps each repo to its star count', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(okResponse(281))
      .mockResolvedValueOnce(okResponse(42))

    await expect(
      collectStars(['dcouple/Pane', 'bengry/typedash'], fetchImpl)
    ).resolves.toEqual({ 'dcouple/Pane': 281, 'bengry/typedash': 42 })
  })

  it('omits repos that failed rather than writing a zero', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(errorResponse(500))
      .mockResolvedValueOnce(okResponse(42))

    const counts = await collectStars(['a/b', 'bengry/typedash'], fetchImpl)
    expect(counts).toEqual({ 'bengry/typedash': 42 })
    expect(counts['a/b']).toBeUndefined()
  })
})
