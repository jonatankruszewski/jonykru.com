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
        className="w-44 border border-rule bg-canvas z-50 [--anchor-gap:0.5rem]"
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code}>
            <button
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-start font-mono text-label uppercase tracking-label transition-colors ${
                language === lang.code
                  ? 'bg-accent text-accent-ink'
                  : 'text-ink-muted hover:bg-surface hover:text-ink'
              }`}
            >
              <span>{t(lang.labelKey)}</span>
              {language === lang.code && (
                <Check size={14} className="ms-auto" aria-hidden />
              )}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export default LanguageSwitcher
