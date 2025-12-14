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
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 lg:border lg:border-gray-400 lg:dark:border-gray-600 lg:hover:border-gray-600 lg:dark:hover:border-gray-400 hover:scale-110 active:scale-95 cursor-pointer"
      aria-label={label}
      title={label}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-gray-900" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  )
}

export default ThemeToggle
