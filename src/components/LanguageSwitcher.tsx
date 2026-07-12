'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Check, Globe } from 'lucide-react'
import { Language, useI18n } from '@/context/i18nContext'

const languages: { code: Language; labelKey: string }[] = [
  { code: 'en', labelKey: 'language.english' },
  { code: 'es', labelKey: 'language.spanish' },
  { code: 'he', labelKey: 'language.hebrew' }
]

const LanguageSwitcher = () => {
  const { language, setLanguage, t, isRTL } = useI18n()

  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="flex items-center justify-center p-2 text-ink hover:bg-surface transition-colors"
        aria-label={t('language.title')}
        title={t('language.title')}
      >
        <Globe size={18} />
      </MenuButton>

      <MenuItems
        anchor={isRTL ? 'bottom start' : 'bottom end'}
        className="w-44 border border-rule bg-canvas z-50 [--anchor-gap:0.5rem] focus:outline-none"
      >
        {languages.map((lang) => {
          const selected = language === lang.code

          return (
            <MenuItem key={lang.code}>
              {/*
                Headless UI drives keyboard navigation by setting data-focus on
                the active item rather than moving the browser's focus ring, so
                without a data-focus style arrowing through the menu is
                invisible — which reads as "keyboard nav is broken".
              */}
              <button
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-start font-mono text-label uppercase tracking-label transition-colors focus:outline-none ${
                  selected
                    ? 'bg-accent text-accent-ink data-focus:outline data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-ink'
                    : 'text-ink-muted data-focus:bg-ink data-focus:text-canvas hover:bg-ink hover:text-canvas'
                }`}
              >
                <span>{t(lang.labelKey)}</span>
                {selected && (
                  <Check size={14} className="ms-auto" aria-hidden />
                )}
              </button>
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}

export default LanguageSwitcher
