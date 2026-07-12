/**
 * Parses the palette blocks out of globals.css.
 *
 * Theming is plain CSS, and plain CSS cannot share a declaration block across a
 * media query — so the light palette is necessarily written twice: once under
 * `prefers-color-scheme: light`, once as the `html.light` override the toggle
 * writes. Two copies of anything drift. This exists so a test can assert they
 * are identical, and that every theme defines the same set of tokens.
 */
export type Palette = Record<string, string>

const declarations = (block: string): Palette => {
  const palette: Palette = {}

  for (const [, name, value] of block.matchAll(
    /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi
  )) {
    palette[name] = value.trim().toLowerCase()
  }

  return palette
}

/** Body of the first rule whose selector list matches `selector`. */
export const paletteFor = (css: string, selector: string): Palette => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const rule = new RegExp(`(?:^|[,}])\\s*${escaped}\\s*\\{([^}]*)\\}`, 'm')
  const body = css.match(rule)?.[1]

  return body ? declarations(body) : {}
}

/** The `:root` block nested inside the prefers-color-scheme: light media query. */
export const lightMediaPalette = (css: string): Palette => {
  const media = css.match(
    /@media\s*\(prefers-color-scheme:\s*light\)\s*\{\s*:root\s*\{([^}]*)\}/
  )?.[1]

  return media ? declarations(media) : {}
}
