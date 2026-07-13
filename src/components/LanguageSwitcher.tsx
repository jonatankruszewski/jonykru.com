'use client'

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Check, Globe } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useI18n } from '@/context/i18nContext'
import { type Locale, localePath, LOCALES, stripLocale } from '@/lib/locale'

const LABEL_KEY: Record<Locale, string> = {
  en: 'language.english',
  es: 'language.spanish',
  he: 'language.hebrew'
}

// Switching language is now navigation: the same page, re-prefixed with the
// target locale. That keeps every language a real, shareable, indexable URL.
const LanguageSwitcher = () => {
  const { language, t, isRTL } = useI18n()
  const pathname = usePathname()
  const basePath = stripLocale(pathname)

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
        {LOCALES.map((code) => {
          const selected = language === code

          return (
            <MenuItem
              key={code}
              as={Link}
              href={localePath(code, basePath)}
              hrefLang={code}
              className={`flex w-full items-center gap-3 px-4 py-3 text-start font-mono text-label uppercase tracking-label transition-colors focus:outline-none ${
                selected
                  ? 'bg-accent text-accent-ink data-focus:outline data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-ink'
                  : 'text-ink-muted data-focus:bg-ink data-focus:text-canvas hover:bg-ink hover:text-canvas'
              }`}
            >
              <span>{t(LABEL_KEY[code])}</span>
              {selected && <Check size={14} className="ms-auto" aria-hidden />}
            </MenuItem>
          )
        })}
      </MenuItems>
    </Menu>
  )
}

export default LanguageSwitcher
