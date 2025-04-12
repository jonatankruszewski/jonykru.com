'use client'
import { useForm as useFormSpreeForm } from '@formspree/react'
import { Button } from '@headlessui/react'
import { Check, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Toast } from 'radix-ui'
import React, { useEffect, useRef } from 'react'
import { FormProvider, useForm as useReactHookForm } from 'react-hook-form'
import GithubIcon from '@/assets/github-icon.svg'
import LinkedinIcon from '@/assets/linkedin-icon.svg'
import MediumIcon from '@/assets/medium-icon-white.svg'
import StackOverflow from '@/assets/stack-overflow-icon.svg'
import TextAreaInput from '@/components/TextAreaInput'
import TextInput from '@/components/TextInput'
import Section from '@/utils/Section'
import { motion } from 'framer-motion'

type FormData = {
  email: string
  subject: string
  message: string
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const EmailSection = () => {
  const [state, handleSubmit, handleReset] =
    useFormSpreeForm<FormData>('xwpleawo')
  const methods = useReactHookForm<FormData>({ mode: 'onTouched' })
  const { handleSubmit: useFormSubmit, control } = methods
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const [open, setOpen] = React.useState(false)

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
      handleReset()
      // setOpen(true)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.succeeded])

  React.useEffect(() => {
    return () => timerRef && clearTimeout(timerRef.current)
  }, [])

  React.useEffect(() => {
    if (!state.succeeded) {
      return
    }

    timerRef && clearTimeout(timerRef.current)
    setOpen(true)
    setTimeout(() => {
      setOpen(false)
    }, 5000)

    return () => timerRef && clearTimeout(timerRef.current)
  }, [state.succeeded])

  console.info({ state })

  return (
    <Section id="contact">
      <h2 className="text-center text-4xl font-bold text-white mb-12 mt-20">
        Let&apos;s Connect
      </h2>
      <div className="grid md:grid-cols-2 gap-4 relative">
        <div>
          <p className="text-[#ADB7BE] mb-4 max-w-md">
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
                className="rounded-lg"
              />
            </Link>
            <Link href="https://www.linkedin.com/in/jonatankruszewski">
              <Image
                width={48}
                src={LinkedinIcon}
                alt="Linkedin Icon"
                className="rounded-lg"
              />
            </Link>
            <Link href="https://medium.com/@jonakrusze">
              <Image
                width={48}
                src={MediumIcon}
                alt="Medium Icon"
                className="rounded-lg"
              />
            </Link>
            <Link href="https://stackoverflow.com/users/17625486/jonatan-kruszewski">
              <Image
                width={48}
                src={StackOverflow}
                alt="Medium Icon"
                className="rounded-lg"
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
                className="self-center inline-block flex-shrink-0 max-w-min whitespace-nowrap border-2 border-gray-300 text-gray-200 hover:border-white hover:text-white cursor-pointer font-medium py-2.5 px-5 rounded-full"
              >
                {state.submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="flex justify-between items-center gap-x-[15px] rounded-lg bg-white p-[15px]"
          open={open}
          onOpenChange={setOpen}
        >
          <motion.li
            // initial={{ opacity: 0, scale: 0.95 }}
            // animate={{
            //   opacity: 1,
            //   scale: 1,
            //   transition: { duration: 0.1, ease: 'easeOut' }
            // }}
            // exit={{
            //   opacity: 0,
            //   scale: 0.95,
            //   transition: { duration: 0.1, ease: 'easeOut' }
            // }}
            initial={{ x: 100, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: { duration: 0.2, ease: 'easeOut' }
            }}
            exit={{
              x: 100,
              opacity: 0,
              transition: { duration: 0.2, ease: 'easeIn' }
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Toast.Title className="flex gap-3 items-center text-[15px] font-medium text-slate12">
              <Check className="text-green-500" size={28} />
              Thanks for your message!
            </Toast.Title>
            <Toast.Action asChild altText="Close">
              <button
                onClick={() => {
                  setOpen(false)
                  clearTimeout(timerRef.current)
                }}
                className="cursor-pointer ml-auto"
              >
                <X className="text-slate-500 hover:text-slate-900" size={28} />
              </button>
            </Toast.Action>
          </motion.li>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 outline-none [--viewport-padding:_25px]" />
      </Toast.Provider>
    </Section>
  )
}

export default EmailSection
