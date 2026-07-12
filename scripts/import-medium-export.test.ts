import { describe, expect, it } from 'vitest'
import { parseExportedPost } from './import-medium-export'

const post = ({
  canonical = true,
  title = true,
  published = true,
  name = 'A Real Article'
} = {}) => `
<html><head><title>${name}</title></head><body>
  <article class="h-entry">
    ${canonical ? '<a href="https://medium.com/@jonakrusze/a-real-article-abc123" class="p-canonical">x</a>' : ''}
    ${published ? '<time class="dt-published" datetime="2024-08-27T10:00:00.000Z">Aug 27</time>' : ''}
    <h1 class="p-name">${name}</h1>
    <section class="e-content">
      ${title ? '<h3 class="graf graf--h3 graf--leading graf--title">' + name + '</h3>' : ''}
      <p class="graf graf--p">Body text.</p>
    </section>
  </article>
</body></html>`

describe('parseExportedPost', () => {
  it('parses a published article', () => {
    const parsed = parseExportedPost(post())
    expect(parsed).not.toBeNull()
    expect(parsed?.title).toBe('A Real Article')
    expect(parsed?.pubDate).toBe('2024-08-27T10:00:00.000Z')
    expect(parsed?.link).toBe(
      'https://medium.com/@jonakrusze/a-real-article-abc123'
    )
  })

  it('skips a draft — no canonical URL', () => {
    // Drafts DO carry graf--title, so the canonical check is what excludes them.
    expect(parseExportedPost(post({ canonical: false }))).toBeNull()
  })

  it('skips a response — no graf--title', () => {
    // Responses are published (they have a canonical URL) and can run to
    // hundreds of words, so only the missing article title separates them.
    expect(parseExportedPost(post({ title: false }))).toBeNull()
  })

  it('skips anything without a publish date', () => {
    expect(parseExportedPost(post({ published: false }))).toBeNull()
  })

  it('decodes HTML entities in the title', () => {
    const parsed = parseExportedPost(
      post({ name: 'Why Zero Tech Debt Is a Myth &amp; a Red Flag' })
    )
    expect(parsed?.title).toBe('Why Zero Tech Debt Is a Myth & a Red Flag')
  })

  it('uses the canonical URL as the guid so merges dedupe correctly', () => {
    const parsed = parseExportedPost(post())
    expect(parsed?.guid).toBe(parsed?.link)
  })

  it('handles either attribute order on the canonical link', () => {
    // The real export writes href before class. A regex that assumed the other
    // order silently parsed zero articles out of 84 files.
    const classFirst = `
      <a class="p-canonical" href="https://medium.com/@jonakrusze/x-1">x</a>
      <time class="dt-published" datetime="2024-01-01T00:00:00.000Z"></time>
      <h1 class="p-name">T</h1><h3 class="graf--title">T</h3>`
    expect(parseExportedPost(classFirst)?.link).toBe(
      'https://medium.com/@jonakrusze/x-1'
    )
  })
})
