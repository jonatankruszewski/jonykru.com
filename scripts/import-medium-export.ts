/**
 * Imports a Medium "Download your information" export into mediumData.json.
 *
 * Medium's RSS only ever returns the latest 10 posts, and every other route
 * (profile page, GraphQL, article pages, even crawler user-agents) is behind
 * Cloudflare. The official export is the only way to get the full archive.
 *
 * Usage:
 *   pnpm import-medium <path-to-unzipped-export>
 *
 * The export contains posts/*.html. Drafts have no canonical URL and are
 * skipped — only published posts make it onto the site.
 *
 * Results are MERGED into the existing data (see mergeArticles), so this is safe
 * to run repeatedly and will not clobber images already downloaded locally.
 */
import fs from 'node:fs'
import path from 'node:path'
import { mergeArticles, readExistingJson } from './update-medium'
import type { MediumFlatData } from '../src/types/medium.types'

const DATA_PATH = path.join(process.cwd(), 'src/dataFetchers/mediumData.json')

const decodeEntities = (value: string): string =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')

const stripTags = (value: string): string =>
  decodeEntities(value.replace(/<[^>]+>/g, '')).trim()

/**
 * Medium's export puts articles, drafts and *responses* (comments on other
 * people's posts) all in posts/, with identical microformat classes. Two markers
 * separate them, and both are required:
 *
 *   p-canonical  — published. Drafts have none.
 *   graf--title  — a real article title in the body. A response has none: its
 *                  "title" is just its first sentence, so title-based or
 *                  length-based filtering misclassifies the long ones.
 *
 * On the real export this yields 24 articles out of 84 files (22 drafts,
 * 38 responses).
 */
export const parseExportedPost = (html: string): MediumFlatData | null => {
  // Attribute order varies (`href` before `class` in the real export), so match
  // the tag first and pull attributes out of it rather than assuming an order.
  const canonicalTag =
    html.match(/<a\b[^>]*\bclass="[^"]*p-canonical[^"]*"[^>]*>/) ??
    html.match(/<a\b[^>]*p-canonical[^>]*>/)
  const canonical = canonicalTag?.[0].match(/href="([^"]+)"/)?.[1]
  if (!canonical) return null

  if (!html.includes('graf--title')) return null

  const timeTag = html.match(/<time\b[^>]*dt-published[^>]*>/)
  const published = timeTag?.[0].match(/datetime="([^"]+)"/)?.[1]
  if (!published) return null

  const rawTitle =
    html.match(/<h1[^>]*class="[^"]*p-name[^"]*"[^>]*>([\s\S]*?)<\/h1>/)?.[1] ??
    html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ??
    ''

  const title = stripTags(rawTitle)
  if (!title) return null

  return {
    title,
    pubDate: published,
    guid: canonical,
    link: canonical,
    categories: [],
    image: ''
  }
}

export const collectPosts = (exportDir: string): MediumFlatData[] => {
  const postsDir = fs.existsSync(path.join(exportDir, 'posts'))
    ? path.join(exportDir, 'posts')
    : exportDir

  if (!fs.existsSync(postsDir)) {
    throw new Error(`No such directory: ${postsDir}`)
  }

  const files = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.html'))

  const posts: MediumFlatData[] = []
  let skipped = 0

  for (const file of files) {
    const html = fs.readFileSync(path.join(postsDir, file), 'utf8')
    const post = parseExportedPost(html)

    if (post) {
      posts.push(post)
    } else {
      skipped += 1
    }
  }

  console.log(
    `   ${files.length} files → ${posts.length} articles (${skipped} drafts/responses skipped)`
  )
  return posts
}

const main = () => {
  const exportDir = process.argv[2]

  if (!exportDir) {
    console.error('Usage: pnpm import-medium <path-to-unzipped-export>')
    process.exit(1)
  }

  console.log(`\n📰 Importing Medium export from ${exportDir}\n`)

  const imported = collectPosts(exportDir)
  if (imported.length === 0) {
    throw new Error('No published posts found — is this the right directory?')
  }

  const existing = readExistingJson(DATA_PATH)
  const merged = mergeArticles(existing, imported)

  fs.writeFileSync(DATA_PATH, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')

  console.log(`   Had ${existing.length}, imported ${imported.length}`)
  console.log(`\n✅ mediumData.json now holds ${merged.length} articles`)
  console.log('   Run `pnpm update-medium` to fetch the cover images.\n')
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  try {
    main()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
