/**
 * Refreshes GitHub star counts for the open-source projects listed on the site.
 *
 * Star counts are data, not copy. Hardcoding them into a component is how the
 * site ended up claiming "36 certifications" when it had 33.
 *
 * Usage: pnpm update-oss
 */
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { OSS_PROJECTS } from '../src/data/openSource'

const OUTPUT = path.join(process.cwd(), 'src/data/starCounts.json')

export const fetchStars = async (
  repo: string,
  fetchImpl: typeof fetch = fetch
): Promise<number | null> => {
  const response = await fetchImpl(`https://api.github.com/repos/${repo}`, {
    headers: { Accept: 'application/vnd.github+json' }
  })

  if (!response.ok) {
    console.warn(
      `⚠️  ${repo}: HTTP ${response.status} — keeping previous count`
    )
    return null
  }

  const body = (await response.json()) as { stargazers_count?: number }
  return typeof body.stargazers_count === 'number'
    ? body.stargazers_count
    : null
}

export const collectStars = async (
  repos: string[],
  fetchImpl: typeof fetch = fetch
): Promise<Record<string, number>> => {
  const counts: Record<string, number> = {}

  for (const repo of repos) {
    const stars = await fetchStars(repo, fetchImpl)
    if (stars !== null) {
      counts[repo] = stars
      console.log(`★ ${stars.toLocaleString()} — ${repo}`)
    }
  }

  return counts
}

const main = async () => {
  const repos = OSS_PROJECTS.map((project) => project.repo)
  const counts = await collectStars(repos)

  if (Object.keys(counts).length === 0) {
    throw new Error('No star counts fetched — refusing to write an empty file.')
  }

  await writeFile(OUTPUT, `${JSON.stringify(counts, null, 2)}\n`, 'utf-8')
  console.log(`\n✅ Wrote ${OUTPUT}`)
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
