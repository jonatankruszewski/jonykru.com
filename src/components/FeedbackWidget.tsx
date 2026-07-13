'use client'

import { useForm as useFormSpreeForm } from '@formspree/react'
import { Check, MessageSquare, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useEffect } from 'react'
import { FormProvider, useForm as useReactHookForm } from 'react-hook-form'
import TextAreaInput from '@/components/TextAreaInput'
import TextInput from '@/components/TextInput'
import { useI18n } from '@/context/i18nContext'

type FeedbackData = {
  email: string
  message: string
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const FeedbackWidget = () => {
  const { t } = useI18n()
  // Dedicated Formspree form for feedback, separate from the contact inbox.
  const [state, handleSubmit, resetFormSubmission] =
    useFormSpreeForm<FeedbackData>('maqrypqq')
  const methods = useReactHookForm<FeedbackData>({
    mode: 'onTouched',
    defaultValues: { email: '', message: '' }
  })
  const { handleSubmit: submit, control } = methods

  useEffect(() => {
    if (state.succeeded) methods.reset({ email: '', message: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.succeeded])

  // Closing (or reopening) a submitted dialog should start from a clean form,
  // not the lingering "thank you" panel.
  const handleOpenChange = (open: boolean) => {
    if (!open && state.succeeded) resetFormSubmission()
  }

  return (
    <Dialog.Root onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed bottom-6 end-6 z-40 inline-flex items-center gap-2 border border-ink px-5 py-3 font-mono text-label uppercase tracking-label bg-accent text-accent-ink hover:bg-ink hover:text-canvas transition-colors"
        >
          <MessageSquare size={16} aria-hidden />
          <span>{t('feedback.button')}</span>
        </button>
      </Dialog.Trigger>

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
