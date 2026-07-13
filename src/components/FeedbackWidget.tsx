'use client'

import { useForm as useFormSpreeForm } from '@formspree/react'
import { Check, MessageSquare, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { CSSProperties, PointerEvent, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm as useReactHookForm } from 'react-hook-form'
import TextAreaInput from '@/components/TextAreaInput'
import TextInput from '@/components/TextInput'
import { useI18n } from '@/context/i18nContext'

type FeedbackData = {
  email: string
  message: string
}

type Position = { x: number; y: number }

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Below this many pixels of movement a pointer gesture counts as a tap (opens
// the dialog); beyond it, it's a drag (moves the button, no dialog).
const DRAG_THRESHOLD = 6
const EDGE_GAP = 8
const STORAGE_KEY = 'feedback-button-position'

const FeedbackWidget = () => {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  // Dedicated Formspree form for feedback, separate from the contact inbox.
  const [state, handleSubmit, resetFormSubmission] =
    useFormSpreeForm<FeedbackData>('maqrypqq')
  const methods = useReactHookForm<FeedbackData>({
    mode: 'onTouched',
    defaultValues: { email: '', message: '' }
  })
  const { handleSubmit: submit, control } = methods

  // null → sit at the default bottom-end corner (also the SSR/first-paint state,
  // so hydration matches). Once dragged, an explicit left/top pins it.
  const [pos, setPos] = useState<Position | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const drag = useRef<{
    startX: number
    startY: number
    originX: number
    originY: number
    moved: boolean
  } | null>(null)
  // A drag ends with a synthetic click we must swallow so it doesn't open.
  const suppressClick = useRef(false)

  const clampToViewport = (p: Position): Position => {
    const el = buttonRef.current
    const w = el?.offsetWidth ?? 56
    const h = el?.offsetHeight ?? 56
    const maxX = Math.max(EDGE_GAP, window.innerWidth - w - EDGE_GAP)
    const maxY = Math.max(EDGE_GAP, window.innerHeight - h - EDGE_GAP)
    return {
      x: Math.min(Math.max(EDGE_GAP, p.x), maxX),
      y: Math.min(Math.max(EDGE_GAP, p.y), maxY)
    }
  }

  useEffect(() => {
    if (state.succeeded) methods.reset({ email: '', message: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.succeeded])

  // Restore a previously chosen position, clamped in case the viewport shrank.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return
      const parsed = JSON.parse(saved) as Partial<Position>
      if (typeof parsed?.x === 'number' && typeof parsed?.y === 'number') {
        setPos(clampToViewport({ x: parsed.x, y: parsed.y }))
      }
    } catch {
      // localStorage unavailable or malformed — fall back to the default corner.
    }
  }, [])

  // Keep the button on-screen through resizes and mobile orientation changes.
  useEffect(() => {
    const onResize = () => setPos((p) => (p ? clampToViewport(p) : p))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const el = buttonRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false
    }
    el.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    d.moved = true
    setPos(clampToViewport({ x: d.originX + dx, y: d.originY + dy }))
  }

  const handlePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    drag.current = null
    const el = buttonRef.current
    if (el?.hasPointerCapture(e.pointerId))
      el.releasePointerCapture(e.pointerId)
    if (!d?.moved) return
    // It was a drag: swallow the click and remember where it landed.
    suppressClick.current = true
    const rect = el?.getBoundingClientRect()
    if (!rect) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ x: rect.left, y: rect.top })
      )
    } catch {
      // Persisting is best-effort; the live position still works.
    }
  }

  const handleTriggerClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    setOpen(true)
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    // Closing (or reopening) a submitted dialog should start from a clean form,
    // not the lingering "thank you" panel.
    if (!next && state.succeeded) resetFormSubmission()
  }

  const buttonStyle: CSSProperties = {
    touchAction: 'none',
    ...(pos ? { left: pos.x, top: pos.y } : {})
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={t('feedback.button')}
        title={t('feedback.button')}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleTriggerClick}
        style={buttonStyle}
        className={`fixed ${pos ? '' : 'bottom-6 end-6'} z-40 inline-flex items-center justify-center border border-ink p-4 bg-accent text-accent-ink hover:bg-ink hover:text-canvas transition-colors cursor-grab touch-none select-none active:cursor-grabbing`}
      >
        <MessageSquare size={20} aria-hidden />
      </button>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 border border-ink bg-canvas p-8 focus:outline-none">
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="font-mono text-label uppercase tracking-label text-ink">
              {t('feedback.title')}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t('feedback.close')}
                className="shrink-0 text-ink-muted hover:text-ink transition-colors"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {state.succeeded ? (
            <div className="mt-6 flex flex-col items-center gap-4 py-6 text-center">
              <span
                className="flex items-center justify-center w-11 h-11 bg-accent text-accent-ink"
                aria-hidden
              >
                <Check size={22} strokeWidth={3} />
              </span>
              <p className="text-ink font-semibold">
                {t('feedback.successTitle')}
              </p>
              <p className="text-ink-muted text-sm">
                {t('feedback.successBody')}
              </p>
            </div>
          ) : (
            <>
              <Dialog.Description className="mt-2 mb-6 text-ink-muted text-sm">
                {t('feedback.description')}
              </Dialog.Description>

              <FormProvider {...methods}>
                <form
                  className="flex flex-col gap-2"
                  onSubmit={submit((data) => {
                    // A variable (not a literal) sidesteps the excess-property
                    // check while still tagging the submission for the inbox.
                    const payload = { ...data, source: 'feedback-widget' }
                    return handleSubmit(payload)
                  })}
                >
                  <TextAreaInput<FeedbackData, 'message'>
                    name="message"
                    label={t('feedback.messageLabel')}
                    placeholder={t('feedback.messagePlaceholder')}
                    control={control}
                    rules={{
                      required: t('feedback.validation.messageRequired'),
                      maxLength: {
                        value: 1000,
                        message: t('feedback.validation.messageMaxLength')
                      }
                    }}
                  />

                  <TextInput<FeedbackData, 'email'>
                    label={t('feedback.emailLabel')}
                    control={control}
                    placeholder={t('feedback.emailPlaceholder')}
                    name="email"
                    id="feedback-email"
                    autoComplete="email"
                    rules={{
                      maxLength: {
                        value: 128,
                        message: t('feedback.validation.emailMaxLength')
                      },
                      validate: (value) =>
                        !value ||
                        emailRegex.test(value) ||
                        t('feedback.validation.emailInvalid')
                    }}
                  />

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="mt-4 w-fit px-6 py-3 font-mono text-label uppercase tracking-label border border-ink text-ink hover:bg-ink hover:text-canvas transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {state.submitting
                      ? t('feedback.sending')
                      : t('feedback.submit')}
                  </button>
                </form>
              </FormProvider>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default FeedbackWidget
