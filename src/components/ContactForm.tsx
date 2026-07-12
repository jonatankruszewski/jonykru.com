'use client'

import { useForm as useFormSpreeForm } from '@formspree/react'
import React, { useEffect, useRef } from 'react'
import { FormProvider, useForm as useReactHookForm } from 'react-hook-form'
import TextAreaInput from '@/components/TextAreaInput'
import TextInput from '@/components/TextInput'
import SuccessToast from '@/components/Toast/SuccessToast'
import { useI18n } from '@/context/i18nContext'

type FormData = {
  email: string
  subject: string
  message: string
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const ContactForm = () => {
  const { t } = useI18n()
  const [state, handleSubmit, resetFormSubmission] =
    useFormSpreeForm<FormData>('xwpleawo')
  // Without defaultValues, field.value starts undefined and React logs
  // "changing an uncontrolled input to be controlled" on the first keystroke.
  const methods = useReactHookForm<FormData>({
    mode: 'onTouched',
    defaultValues: { email: '', subject: '', message: '' }
  })
  const { handleSubmit: submit, control } = methods
  const [toastOpen, setToastOpen] = React.useState(false)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (!state.succeeded) return

    methods.reset({ email: '', subject: '', message: '' })
    setToastOpen(true)

    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setToastOpen(false)
      resetFormSubmission()
    }, 5000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.succeeded])

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  const handleToastOpenChange = (open: boolean) => {
    setToastOpen(open)
    if (!open) {
      if (timerRef.current) clearTimeout(timerRef.current)
      resetFormSubmission()
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col gap-2"
        onSubmit={submit((data) => handleSubmit(data))}
      >
        <TextInput<FormData, 'email'>
          label={t('contact.form.email')}
          control={control}
          placeholder={t('contact.form.emailPlaceholder')}
          name="email"
          id="email"
          autoComplete="email"
          rules={{
            required: t('contact.validation.emailRequired'),
            maxLength: {
              value: 128,
              message: t('contact.validation.emailMaxLength')
            },
            validate: (value) =>
              value.includes('@') || t('contact.validation.emailAtSign'),
            pattern: {
              value: emailRegex,
              message: t('contact.validation.emailInvalid')
            }
          }}
        />

        <TextInput<FormData, 'subject'>
          label={t('contact.form.subject')}
          control={control}
          name="subject"
          type="text"
          id="subject"
          autoComplete="off"
          placeholder={t('contact.form.subjectPlaceholder')}
          rules={{
            required: t('contact.validation.subjectRequired'),
            maxLength: {
              value: 128,
              message: t('contact.validation.subjectMaxLength')
            },
            minLength: {
              value: 4,
              message: t('contact.validation.subjectMinLength')
            }
          }}
        />

        <TextAreaInput<FormData, 'message'>
          name="message"
          label={t('contact.form.message')}
          placeholder={t('contact.form.messagePlaceholder')}
          control={control}
          rules={{
            required: t('contact.validation.messageRequired'),
            maxLength: {
              value: 256,
              message: t('contact.validation.messageMaxLength')
            }
          }}
        />

        <button
          type="submit"
          disabled={state.submitting}
          className="mt-4 w-fit px-6 py-3 font-mono text-label uppercase tracking-label border border-ink text-ink hover:bg-ink hover:text-canvas transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.submitting
            ? t('contact.form.sending')
            : t('contact.form.sendMessage')}
        </button>
      </form>

      <SuccessToast open={toastOpen} onOpenChange={handleToastOpenChange} />
    </FormProvider>
  )
}

export default ContactForm
