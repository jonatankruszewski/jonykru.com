'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage synchronously (SSR-safe)
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') {
      return 'dark'
    }

    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme
      }
    } catch {
      // localStorage not available
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  // Only toggle the class — the canvas colour comes from the tokens in
  // globals.css, so writing background-color here would override the theme.
  useEffect(() => {
    setMounted(true)
    document.documentElement.classList.toggle('dark', theme === 'dark')

    if (mounted) {
      localStorage.setItem('theme', theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
