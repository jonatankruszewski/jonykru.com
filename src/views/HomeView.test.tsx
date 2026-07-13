// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import { I18nProvider } from '@/context/i18nContext'
import HomeView from '@/views/HomeView'

// jsdom has no matchMedia. Report reduced motion so the Typewriter renders its
// static, timer-free path — the animation isn't what these tests are about.
beforeAll(() => {
  window.matchMedia = (query: string) =>
    ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false
    }) as unknown as MediaQueryList
})

const renderHome = () =>
  render(
    <I18nProvider locale="en">
      <HomeView />
    </I18nProvider>
  )

describe('HomeView open-source teaser', () => {
  it('features exactly the two authored projects as cards, not the collaborations', () => {
    renderHome()

    // Repo paths only ever render inside a RepoCard, so they are a reliable
    // proxy for "this project has a card".
    expect(screen.getByText('rxova/journey')).toBeTruthy()
    expect(screen.getByText('rxova/use-everywhere')).toBeTruthy()
    expect(screen.queryByText('dcouple/Pane')).toBeNull()
  })

  it('still names the collaborations in the section copy', () => {
    renderHome()
    expect(screen.getByText(/immer, typedash, and Pane/)).toBeTruthy()
  })
})

describe('HomeView derived copy (no hand-typed numbers)', () => {
  it('interpolates the authored/package counts into the open-source lede', () => {
    renderHome()
    expect(
      screen.getByText(/2 projects of my own across 5 published packages/)
    ).toBeTruthy()
  })

  it('interpolates the certification total into the certs teaser', () => {
    renderHome()
    expect(
      screen.getByText(/^33 exams graded by someone other than me/)
    ).toBeTruthy()
  })
})

describe('HomeView certifications teaser', () => {
  it('surfaces the three AI badges as cards', () => {
    renderHome()
    expect(screen.getByText(/AWS Certified AI Practitioner/)).toBeTruthy()
    expect(screen.getByText(/Azure AI Fundamentals/)).toBeTruthy()
    expect(screen.getByText(/GitHub Copilot/)).toBeTruthy()
  })
})
