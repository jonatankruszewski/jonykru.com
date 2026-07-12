/**
 * Guards the flat, tokenised design.
 *
 * The token layer already deletes Tailwind's shadow/blur/colour namespaces, so
 * `shadow-lg` silently compiles to nothing — which is worse than failing, because
 * it looks intentional in the source. This turns that silence into an error, and
 * also catches raw hex values that bypass the palette entirely.
 *
 * Usage: pnpm check-flat
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

type Violation = { file: string; line: number; match: string; rule: string }

const CLASS_TAIL = String.raw`[\w[\]#().%/-]*`

const RULES: { rule: string; pattern: RegExp }[] = [
  {
    rule: 'no-shadow',
    pattern: new RegExp(
      String.raw`\b(?:dark:)?(?:inset-|drop-)?shadow-${CLASS_TAIL}`,
      'g'
    )
  },
  {
    rule: 'no-blur',
    pattern: new RegExp(
      String.raw`\b(?:dark:)?(?:backdrop-)?blur-${CLASS_TAIL}`,
      'g'
    )
  },
  {
    rule: 'no-gradient',
    pattern: new RegExp(
      String.raw`\bbg-(?:gradient|linear|radial|conic)-${CLASS_TAIL}|\b(?:from|via|to)-\[?#${CLASS_TAIL}`,
      'g'
    )
  },
  {
    rule: 'no-raw-hex',
    pattern:
      /\b(?:bg|text|border|fill|stroke|ring|outline|decoration)-\[#[0-9a-fA-F]{3,8}\]/g
  }
]

const SEARCH_ROOT = path.join(process.cwd(), 'src')

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return walk(full)
      return /\.(tsx?|css)$/.test(entry.name) ? [full] : []
    })
  )
  return files.flat()
}

export const findViolations = (file: string, contents: string): Violation[] => {
  const violations: Violation[] = []

  contents.split('\n').forEach((line, index) => {
    if (line.includes('check-flat-ignore')) return

    // A custom-property declaration is a token definition, not a utility class.
    // The `--shadow-*: initial` resets in globals.css are what enforce flatness.
    if (/^\s*--/.test(line)) return

    for (const { rule, pattern } of RULES) {
      const matches = line.match(new RegExp(pattern.source, pattern.flags))
      for (const match of matches ?? []) {
        violations.push({ file, line: index + 1, match, rule })
      }
    }
  })

  return violations
}

const main = async () => {
  const files = await walk(SEARCH_ROOT)
  const violations: Violation[] = []

  for (const file of files) {
    const contents = await readFile(file, 'utf-8')
    violations.push(
      ...findViolations(path.relative(process.cwd(), file), contents)
    )
  }

  if (violations.length > 0) {
    console.error('❌ Flat-design violations:\n')
    for (const v of violations) {
      console.error(`  ${v.file}:${v.line}  [${v.rule}]  ${v.match}`)
    }
    console.error(
      '\nThe design has no shadows, blurs or gradients, and colours come from the' +
        '\ntokens in globals.css. Add "check-flat-ignore" to a line to override.'
    )
    process.exit(1)
  }

  console.log(`✅ check-flat: ${files.length} files clean`)
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
