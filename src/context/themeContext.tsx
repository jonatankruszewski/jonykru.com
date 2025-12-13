'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)

    // Get saved theme or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
        document.body.style.backgroundColor = '#121212'
      } else {
        document.documentElement.classList.remove('dark')
        document.body.style.backgroundColor = '#ffffff'
      }
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
      const initialTheme = prefersDark ? 'dark' : 'light'
      setTheme(initialTheme)
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark')
        document.body.style.backgroundColor = '#121212'
      } else {
        document.documentElement.classList.remove('dark')
        document.body.style.backgroundColor = '#ffffff'
      }
    }
  }, [])

  // Update DOM when theme changes
  useEffect(() => {
    if (!mounted) return

    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
      document.body.style.backgroundColor = '#121212'
    } else {
      root.classList.remove('dark')
      document.body.style.backgroundColor = '#ffffff'
    }

    localStorage.setItem('theme', theme)
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
