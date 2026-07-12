/**
 * Renders the OG cards to real .png files in public/og/ at build time.
 *
 * Next's `opengraph-image.tsx` convention would emit them as *extensionless*
 * routes (out/opengraph-image), which breaks twice on this stack:
 *   - `aws s3 sync` infers content-type from the extension, so they would be
 *     served as binary/octet-stream and scrapers would reject them.
 *   - The CloudFront rewrite (infra/cloudfront-rewrite.js) 301s extensionless
 *     paths to a trailing slash, which would 404.
 * Emitting .png sidesteps both.
 *
 * Runs on predev/prebuild, like scripts/generate-version.ts.
 */
import { ImageResponse } from 'next/og'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const OUT_DIR = path.join(process.cwd(), 'public/og')

const CANVAS = '#1E1F22'
const INK = '#DFE1E5'
const MUTED = '#7A7E85'
const ACCENT = '#56A8F5'

export type OgCard = {
  slug: string
  eyebrow: string
  title: string
}

export const OG_CARDS: OgCard[] = [
  { slug: 'home', eyebrow: 'AI Dev', title: 'I build AI systems that ship.' },
  {
    slug: 'open-source',
    eyebrow: 'Open Source',
    title: "I ship code in other people's repos."
  },
  {
    slug: 'certifications',
    eyebrow: 'Certifications',
    title: 'Externally validated across cloud, data and AI.'
  },
  {
    slug: 'writing',
    eyebrow: 'Writing',
    title: 'Architecture, migrations, and the cost of tech debt.'
  },
  { slug: 'contact', eyebrow: 'Contact', title: "Tell me what's stuck." }
]

const card = ({ eyebrow, title }: OgCard) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: CANVAS,
      color: INK,
      padding: 80
    }}
  >
    <div
      style={{
        display: 'flex',
        fontSize: 26,
        letterSpacing: 4,
        color: MUTED
      }}
    >
      {eyebrow.toUpperCase()}
    </div>

    <div
      style={{
        display: 'flex',
        fontSize: 76,
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: -2,
        maxWidth: 940
      }}
    >
      {title}
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{ display: 'flex', background: ACCENT, height: 26, width: 88 }}
      />
      <div
        style={{
          display: 'flex',
          fontSize: 28,
          fontWeight: 700,
          marginLeft: 24
        }}
      >
        Jonatan Kruszewski
      </div>
      <div
        style={{ display: 'flex', fontSize: 28, color: MUTED, marginLeft: 20 }}
      >
        jonykru.com
      </div>
    </div>
  </div>
)

export const renderCard = async (spec: OgCard): Promise<Buffer> => {
  const response = new ImageResponse(card(spec), {
    width: 1200,
    height: 630
  })
  return Buffer.from(await response.arrayBuffer())
}

const main = async () => {
  await mkdir(OUT_DIR, { recursive: true })

  for (const spec of OG_CARDS) {
    const png = await renderCard(spec)
    const file = path.join(OUT_DIR, `${spec.slug}.png`)
    await writeFile(file, png)
    console.log(
      `🖼️  ${path.relative(process.cwd(), file)} (${png.length} bytes)`
    )
  }

  console.log(`✅ Generated ${OG_CARDS.length} OG images`)
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
