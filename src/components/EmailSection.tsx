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
      <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white mb-12 mt-20">
        Let&apos;s Connect
      </h2>
      <div className="grid md:grid-cols-2 gap-4 relative">
        <div>
          <p className="text-gray-800 dark:text-[#ADB7BE] mb-4 max-w-md">
            I’m open to new projects and collaborations. If you&apos;re looking
            for a developer or have a relevant opportunity, please feel free to
            reach out. I’ll get back to you as soon as possible.
          </p>
          <div className="socials flex flex-row gap-3 items-center">
            <Link href="https://github.com/jonatankruszewski">
              <Image
                width={48}
                src={GithubIcon}
                alt="Github Icon"
                className="rounded-lg invert dark:invert-0"
              />
            </Link>
            <Link href="https://www.linkedin.com/in/jonatankruszewski">
              <Image
                width={48}
                src={LinkedinIcon}
                alt="Linkedin Icon"
                className="rounded-lg invert dark:invert-0"
              />
            </Link>
            <Link href="https://medium.com/@jonakrusze">
              <Image
                width={48}
                src={MediumIcon}
                alt="Medium Icon"
                className="rounded-lg invert dark:invert-0"
              />
            </Link>
            <Link href="https://stackoverflow.com/users/17625486/jonatan-kruszewski">
              <Image
                width={48}
                src={StackOverflow}
                alt="Stack Overflow Icon"
                className="rounded-lg invert dark:invert-0"
              />
            </Link>
          </div>
        </div>
        <div>
          <FormProvider {...methods}>
            <form className="flex flex-col" onSubmit={useFormSubmit(onSubmit)}>
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
                className="self-center inline-block flex-shrink-0 max-w-min whitespace-nowrap border-2 border-gray-600 dark:border-gray-300 text-gray-900 dark:text-gray-200 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-transparent cursor-pointer font-medium py-2.5 px-5 rounded-full transition-colors"
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
