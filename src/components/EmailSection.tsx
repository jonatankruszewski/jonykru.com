'use client'
import { useForm as useFormSpreeForm } from '@formspree/react'
import { Button } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Toast } from 'radix-ui'
import React, { useEffect, useRef, useState } from 'react'
import { FormProvider, useForm as useReactHookForm } from 'react-hook-form'
import GithubIcon from '@/assets/github-icon.svg'
import LinkedinIcon from '@/assets/linkedin-icon.svg'
import MediumIcon from '@/assets/medium-icon-white.svg'
import StackOverflow from '@/assets/stack-overflow-icon.svg'
import TextAreaInput from '@/components/TextAreaInput'
import TextInput from '@/components/TextInput'
import Section from '@/utils/Section'

type FormData = {
  email: string
  subject: string
  message: string
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const EmailSection = () => {
  const [state, handleSubmit, resetFormSubmission] =
    useFormSpreeForm<FormData>('xwpleawo')
  const methods = useReactHookForm<FormData>({ mode: 'onTouched' })
  const { handleSubmit: useFormSubmit, control } = methods
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const [open, setOpen] = useState(false)

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
      resetFormSubmission()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.succeeded])

  // TODO: make this imperative
  React.useEffect(() => {
    if (!state.succeeded) {
      return
    }

    const currentTimerRef = timerRef.current
    if (currentTimerRef) {
      clearTimeout(timerRef.current)
    }

    setOpen(true)
    timerRef.current = setTimeout(() => {
      setOpen(false)
    }, 500000)

    return () => {
      if (currentTimerRef) {
        clearTimeout(timerRef.current)
      }
    }
  }, [state.succeeded])

  return (
    <Section id="contact">
      <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-20">
        Let&apos;s Connect
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-lg mx-auto">
        Have a project in mind? Let&apos;s talk about how I can help.
      </p>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="order-2 md:order-1">
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-2xl p-6 md:p-8 border border-violet-100 dark:border-violet-900/50">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Get in touch
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              I&apos;m open to new projects and collaborations. If you&apos;re
              looking for a developer or have a relevant opportunity, please
              feel free to reach out. I&apos;ll get back to you as soon as
              possible.
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
                label="Your Email"
                control={control}
                placeholder="jacob@google.com"
                name={'email'}
                rules={{
                  required: 'Email is required',
                  maxLength: {
                    value: 128,
                    message: 'Email must be at most 128 characters long'
                  },
                  validate: (value) => {
                    if (!value.includes('@')) {
                      return "Please include '@' in your email address"
                    }
                    return true
                  },
                  pattern: {
                    value: emailRegex,
                    message: 'Please enter a valid email address'
                  }
                }}
                id="email"
                autoComplete="email"
              />
              <TextInput<FormData, 'subject'>
                label="Subject"
                control={control}
                name="subject"
                type="text"
                id="subject"
                autoComplete="off"
                placeholder="Just saying hi"
                rules={{
                  required: 'Subject is required',
                  maxLength: {
                    value: 128,
                    message: 'Subject must be at most 128 characters long'
                  },
                  minLength: {
                    value: 4,
                    message: 'Subject must be at least 4 characters long'
                  }
                }}
              />
              <TextAreaInput<FormData, 'message'>
                name="message"
                label="Message"
                control={control}
                rules={{
                  required: 'Message is required',
                  maxLength: {
                    value: 256,
                    message: 'Subject must be at most 256 characters long'
                  }
                }}
              />
              <Button
                name="Send Message"
                type="submit"
                disabled={state.submitting}
                className="mt-4 w-full sm:w-auto sm:self-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {state.submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>

      {/*TODO: move this out to its own*/}
      <Toast.Provider swipeDirection="right">
        <AnimatePresence>
          {open && (
            <Toast.Root
              key={crypto.randomUUID()}
              asChild
              forceMount
              className="border-2  flex justify-between items-center gap-x-[15px] rounded-xl p-[15px] border-gray-400 dark:border-gray-200 bg-gray-100 dark:bg-[#1e1e1e] "
            >
              <motion.div
                layoutId={crypto.randomUUID()}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
              >
                <Toast.Title className="flex gap-3 items-center text-[15px] font-medium text-gray-900 dark:text-[#e0e0e0]">
                  <Check className="text-green-500" size={28} />
                  Message successfully sent
                </Toast.Title>
                <Toast.Action asChild altText="Close">
                  <Button
                    className="cursor-pointer ml-auto"
                    onClick={() => setOpen(false)}
                  >
                    <X
                      className="cursor-pointer hover:text-[#fff] text-[#aaa]"
                      size={28}
                    />
                  </Button>
                </Toast.Action>
              </motion.div>
            </Toast.Root>
          )}
        </AnimatePresence>
        <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      </Toast.Provider>
    </Section>
  )
}

export default EmailSection
