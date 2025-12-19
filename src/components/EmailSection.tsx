'use client'
import { useForm as useFormSpreeForm } from '@formspree/react'
import { Button } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { FormProvider, useForm as useReactHookForm } from 'react-hook-form'
import GithubIcon from '@/assets/github-icon.svg'
import LinkedinIcon from '@/assets/linkedin-icon.svg'
import MediumIcon from '@/assets/medium-icon-white.svg'
import StackOverflow from '@/assets/stack-overflow-icon.svg'
import TextAreaInput from '@/components/TextAreaInput'
import TextInput from '@/components/TextInput'
import SuccessToast from '@/components/Toast/SuccessToast'
import { useI18n } from '@/context/i18nContext'
import Section from '@/utils/Section'

type FormData = {
  email: string
  subject: string
  message: string
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const EmailSection = () => {
  const { t } = useI18n()
  const [state, handleSubmit, resetFormSubmission] =
    useFormSpreeForm<FormData>('xwpleawo')
  const methods = useReactHookForm<FormData>({ mode: 'onTouched' })
  const { handleSubmit: useFormSubmit, control } = methods
  const [toastOpen, setToastOpen] = React.useState(false)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const onSubmit = async (data: FormData) => {
    await handleSubmit(data)
  }

  useEffect(() => {
    if (state.succeeded) {
      methods.reset({
        email: '',
        subject: '',
        message: ''
      })
      setToastOpen(true)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        setToastOpen(false)
        resetFormSubmission()
      }, 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.succeeded])

  const handleToastOpenChange = (open: boolean) => {
    setToastOpen(open)
    if (!open) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      resetFormSubmission()
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <Section id="contact">
      <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-20">
        {t('contact.title')}
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-lg mx-auto">
        {t('contact.subtitle')}
      </p>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="order-2 md:order-1">
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-2xl p-6 md:p-8 border border-violet-100 dark:border-violet-900/50">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {t('contact.getInTouch')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {t('contact.description')}
            </p>
            <div className="flex flex-row gap-4 items-center">
              <Link
                href="https://github.com/jonatankruszewski"
                className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-200"
              >
                <Image
                  width={32}
                  height={32}
                  src={GithubIcon}
                  alt="Github Icon"
                  className="invert dark:invert-0"
                />
              </Link>
              <Link
                href="https://www.linkedin.com/in/jonatankruszewski"
                className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-200"
              >
                <Image
                  width={32}
                  height={32}
                  src={LinkedinIcon}
                  alt="Linkedin Icon"
                  className="invert dark:invert-0"
                />
              </Link>
              <Link
                href="https://medium.com/@jonakrusze"
                className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-200"
              >
                <Image
                  width={32}
                  height={32}
                  src={MediumIcon}
                  alt="Medium Icon"
                  className="invert dark:invert-0"
                />
              </Link>
              <Link
                href="https://stackoverflow.com/users/17625486/jonatan-kruszewski"
                className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-violet-300 dark:hover:border-violet-600 transition-all duration-200"
              >
                <Image
                  width={32}
                  height={32}
                  src={StackOverflow}
                  alt="Stack Overflow Icon"
                  className="invert dark:invert-0"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <FormProvider {...methods}>
            <form
              className="flex flex-col gap-1 bg-white dark:bg-gray-900/50 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-sm"
              onSubmit={useFormSubmit(onSubmit)}
            >
              <TextInput<FormData, 'email'>
                label={t('contact.form.email')}
                control={control}
                placeholder={t('contact.form.emailPlaceholder')}
                name={'email'}
                rules={{
                  required: t('contact.validation.emailRequired'),
                  maxLength: {
                    value: 128,
                    message: t('contact.validation.emailMaxLength')
                  },
                  validate: (value) => {
                    if (!value.includes('@')) {
                      return t('contact.validation.emailAtSign')
                    }
                    return true
                  },
                  pattern: {
                    value: emailRegex,
                    message: t('contact.validation.emailInvalid')
                  }
                }}
                id="email"
                autoComplete="email"
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
              <Button
                name={t('contact.form.sendMessage')}
                type="submit"
                disabled={state.submitting}
                className="mt-4 w-full sm:w-auto sm:self-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              >
                {state.submitting
                  ? t('contact.form.sending')
                  : t('contact.form.sendMessage')}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>

      <SuccessToast open={toastOpen} onOpenChange={handleToastOpenChange} />
    </Section>
  )
}

export default EmailSection
