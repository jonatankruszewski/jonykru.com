'use client'

import { Moon, Sun } from 'lucide-react'
import React from 'react'
import { useI18n } from '@/context/i18nContext'
import { useTheme } from '@/context/themeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()

  const label =
    theme === 'light' ? t('theme.switchToDark') : t('theme.switchToLight')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 text-ink hover:bg-surface transition-colors"
      aria-label={label}
      title={label}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  )
}

export default ThemeToggle
