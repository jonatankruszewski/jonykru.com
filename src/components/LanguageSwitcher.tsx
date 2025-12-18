'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Globe } from 'lucide-react'
import React from 'react'
import { Language, useI18n } from '@/context/i18nContext'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'he', label: 'עברית', flag: '🇮🇱' }
]

const LanguageSwitcher = () => {
  const { language, setLanguage, t, isRTL } = useI18n()

  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="flex items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 lg:border lg:border-gray-400 lg:dark:border-gray-600 lg:hover:border-gray-600 lg:dark:hover:border-gray-400 cursor-pointer"
        aria-label={t('language.title')}
        title={t('language.title')}
      >
        <Globe className="w-5 h-5 text-gray-900 dark:text-white" />
      </MenuButton>

      <MenuItems
        anchor={isRTL ? 'bottom start' : 'bottom end'}
        transition
        className={`absolute ${isRTL ? 'left-0 origin-top-left' : 'right-0 origin-top-right'} mt-2 w-40 rounded-xl bg-white dark:bg-[#1E1E2E] border border-gray-200 dark:border-gray-700 shadow-lg ring-1 ring-black/5 focus:outline-none z-50 transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0`}
      >
        <div className="p-1">
          {languages.map((lang) => (
            <MenuItem key={lang.code}>
              <button
                onClick={() => setLanguage(lang.code)}
                className={`${
                  language === lang.code
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                } group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors duration-150`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
                {language === lang.code && (
                  <span className="ms-auto text-violet-600 dark:text-violet-400">
                    ✓
                  </span>
                )}
              </button>
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  )
}

export default LanguageSwitcher
