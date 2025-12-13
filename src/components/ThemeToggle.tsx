'use client'

import { Moon, Sun } from 'lucide-react'
import React from 'react'
import { useTheme } from '@/context/themeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 border border-gray-400 dark:border-gray-600 hover:border-gray-600 dark:hover:border-gray-400 hover:scale-110 active:scale-95 cursor-pointer"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
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
