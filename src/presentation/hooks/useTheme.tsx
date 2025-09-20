import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: ThemeMode
  actualTheme: 'light' | 'dark'
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: ThemeMode
}

export const ThemeProvider = ({ children, defaultTheme = 'auto' }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  // Get theme from localStorage or use default
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  // Calculate actual theme based on theme mode and system preference
  useEffect(() => {
    const calculateActualTheme = () => {
      if (theme === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return theme === 'dark' ? 'dark' : 'light'
    }

    const updateActualTheme = () => {
      setActualTheme(calculateActualTheme())
    }

    // Initial calculation
    updateActualTheme()

    // Listen for system theme changes if theme is auto
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateActualTheme)
      return () => mediaQuery.removeEventListener('change', updateActualTheme)
    }
  }, [theme])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement

    // Remove existing theme classes
    root.removeAttribute('data-theme')
    root.classList.remove('theme-light', 'theme-dark')

    // Apply new theme
    if (theme !== 'auto') {
      root.setAttribute('data-theme', theme)
      root.classList.add(`theme-${theme}`)
    }

    // Set CSS custom property for JavaScript access
    root.style.setProperty('--theme-mode', actualTheme)
  }, [theme, actualTheme])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'
    setTheme(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}