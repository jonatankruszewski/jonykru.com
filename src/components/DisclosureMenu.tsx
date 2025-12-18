'use client'

import { DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { useFocusTrap } from '@mantine/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import React, { Fragment, useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { FontJetBrainsMono } from '@/app/fonts'

import LanguageSwitcher from '@/components/LanguageSwitcher'
import NavbarLinks from '@/components/NavbarLinks'
import ThemeToggle from '@/components/ThemeToggle'
import { useI18n } from '@/context/i18nContext'
import { useEscapeKey } from '@/utils/useEscape'

const DisclosureMenu = ({
  open,
  close
}: {
  open: boolean
  close: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { t, isRTL } = useI18n()
  useOnClickOutside(ref as React.RefObject<HTMLElement>, () => close())
  useEscapeKey(() => close(), { dependencies: [open] })
  const focusTrapRef = useFocusTrap(open)

  return (
    <>
      <div className="flex w-full flex-wrap items-center justify-between px-4 py-4">
        <p
          className={`${FontJetBrainsMono.className} py-2 ps-3 pe-4 text-xl lg:p-0 select-none bg-gradient-to-br from-indigo-500  to-purple-400 bg-clip-text text-transparent`}
        >
          jonykru<span className="text-gray-900 dark:text-white">.</span>com
        </p>
        <div
          className="menu hidden lg:flex lg:items-center lg:gap-4"
          id="navbar"
        >
          <ul className="flex p-4 lg:p-0 lg:flex-row lg:gap-x-8 mt-0">
            <NavbarLinks />
          </ul>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 lg:hidden ms-auto">
          <LanguageSwitcher />
          <ThemeToggle />
          <DisclosureButton
            name={open ? t('nav.close') : t('nav.menu')}
            aria-label={open ? t('nav.close') : t('nav.menu')}
            className="cursor-pointer px-2 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {open ? <X /> : <Menu />}
          </DisclosureButton>
        </div>
      </div>

      <div className="overflow-hidden lg:hidden" ref={ref}>
        <div ref={focusTrapRef}>
          <AnimatePresence>
            {open && (
              <DisclosurePanel static as={Fragment}>
                <motion.div
                  initial={{ opacity: 0, y: -24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="origin-top"
                >
                  <ul
                    className={`flex-1 px-4 pb-4 flex flex-col bg-white dark:bg-[#121212] ${isRTL ? 'items-end' : 'items-start'}`}
                  >
                    <NavbarLinks onClick={close} />
                  </ul>
                </motion.div>
              </DisclosurePanel>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}

export default DisclosureMenu
