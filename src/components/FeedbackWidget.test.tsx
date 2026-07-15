// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import FeedbackWidget from '@/components/FeedbackWidget'
import { I18nProvider } from '@/context/i18nContext'

// The widget posts through Formspree; stub the hook so the test never touches
// the network and we control the submission state.
const submitState = { submitting: false, succeeded: false, errors: null }
vi.mock('@formspree/react', () => ({
  useForm: () => [submitState, vi.fn(), vi.fn()]
}))

// jsdom implements neither pointer capture nor layout, so give the drag logic
// the handful of DOM hooks it reaches for.
beforeAll(() => {
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
  Element.prototype.hasPointerCapture = () => false
})

const renderWidget = () =>
  render(
    <I18nProvider>
      <FeedbackWidget />
    </I18nProvider>
  )

const trigger = () => screen.getByRole('button', { name: /give feedback/i })

describe('FeedbackWidget', () => {
  it('renders a feedback trigger and keeps the form closed until asked', () => {
    renderWidget()

    expect(trigger()).toBeTruthy()
    // The form lives behind the dialog, so its message field is absent at rest.
    expect(screen.queryByPlaceholderText(/what's on your mind/i)).toBeNull()
  })

  it('opens the dialog with the feedback form when the trigger is tapped', () => {
    renderWidget()

    fireEvent.click(trigger())

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /send feedback/i })).toBeTruthy()
  })

  it('treats a drag past the threshold as a move, not an open', () => {
    renderWidget()
    // The draggable surface is the launcher wrapper around the trigger.
    const wrapper = trigger().parentElement as HTMLElement

    fireEvent.pointerDown(wrapper, { pointerId: 1, clientX: 100, clientY: 100 })
    fireEvent.pointerMove(wrapper, { pointerId: 1, clientX: 160, clientY: 160 })
    fireEvent.pointerUp(wrapper, { pointerId: 1, clientX: 160, clientY: 160 })
    // The browser fires a click after the drag; the widget must swallow it.
    fireEvent.click(trigger())

    expect(screen.queryByRole('dialog')).toBeNull()
    // The dragged launcher is pinned with explicit coordinates instead of the
    // default corner classes.
    expect(wrapper.style.left).not.toBe('')
    expect(wrapper.className).not.toContain('bottom-6')
  })

  it('hides the launcher when the dismiss button is clicked', () => {
    renderWidget()

    fireEvent.click(
      screen.getByRole('button', { name: /hide feedback button/i })
    )

    expect(screen.queryByRole('button', { name: /give feedback/i })).toBeNull()
  })
})
