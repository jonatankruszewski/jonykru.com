'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Client-only: a stored choice wins, else the OS preference. Dark-first — the
  // design is an IDE, and an IDE is dark unless you say otherwise.
  const detectTheme = (): Theme => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
    } catch {
      // localStorage not available
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark'
  }

  // Start 'dark' (the SSR default) so the first client render matches the
  // server. Reading matchMedia/localStorage during init desyncs them and fails
  // hydration (the toggle icon differs, React #418); the real theme lands after
  // mount.
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTheme(detectTheme())
  }, [])

  // globals.css already paints the right theme from prefers-color-scheme with no
  // JavaScript, so this only writes an *override* class — and only after mount,
  // so it never fights the CSS default before the real theme is known (no flash).
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const next = prevTheme === 'light' ? 'dark' : 'light'
      try {
        localStorage.setItem('theme', next)
      } catch {
        // localStorage not available
      }
      return next
    })
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
