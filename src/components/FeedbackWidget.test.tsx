// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FeedbackWidget from '@/components/FeedbackWidget'
import { I18nProvider } from '@/context/i18nContext'

// The widget posts through Formspree; stub the hook so the test never touches
// the network and we control the submission state.
const submitState = { submitting: false, succeeded: false, errors: null }
vi.mock('@formspree/react', () => ({
  useForm: () => [submitState, vi.fn(), vi.fn()]
}))

const renderWidget = () =>
  render(
    <I18nProvider>
      <FeedbackWidget />
    </I18nProvider>
  )

describe('FeedbackWidget', () => {
  it('renders a feedback trigger and keeps the form closed until asked', () => {
    renderWidget()

    expect(screen.getByRole('button', { name: /give feedback/i })).toBeTruthy()
    // The form lives behind the dialog, so its message field is absent at rest.
    expect(screen.queryByPlaceholderText(/what's on your mind/i)).toBeNull()
  })

  it('opens the dialog with the feedback form when the trigger is clicked', () => {
    renderWidget()

    fireEvent.click(screen.getByRole('button', { name: /give feedback/i }))

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /send feedback/i })).toBeTruthy()
  })
})
