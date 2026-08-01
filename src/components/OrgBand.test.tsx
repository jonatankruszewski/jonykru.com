// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import OrgBand from '@/components/OrgBand'
import { I18nProvider } from '@/context/i18nContext'
import { RXOVA_ORG } from '@/data/openSource'
import { byOrg } from '@/lib/openSource'

const renderBand = () =>
  render(
    <I18nProvider>
      <OrgBand org={RXOVA_ORG} />
    </I18nProvider>
  )

describe('OrgBand', () => {
  it('names the org and links to both of its homes', () => {
    renderBand()

    expect(screen.getByRole('heading', { name: 'rxova' })).toBeTruthy()

    const site = screen.getByRole('link', { name: /rxova\.org/ })
    expect(site.getAttribute('href')).toBe('https://rxova.org')

    const github = screen.getByRole('link', { name: /GitHub org/ })
    expect(github.getAttribute('href')).toBe('https://github.com/rxova')
  })

  // The blurb used to say "three monorepos" in prose. Adding a fourth repo
  // would have made it a lie, the same way the hand-typed stats did.
  it('derives the repo count instead of hard-coding it into the copy', () => {
    renderBand()
    const count = byOrg(RXOVA_ORG.id).length

    expect(screen.getByText(String(count))).toBeTruthy()
    expect(
      screen.getByText(new RegExp(`${count} monorepos, one release pipeline`))
    ).toBeTruthy()
  })
})
