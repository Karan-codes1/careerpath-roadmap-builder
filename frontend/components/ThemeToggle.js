'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

/**
 * Switches between light and dark mode.
 * The theme is a `dark` class on <html>: Tailwind's `dark:` styles apply
 * whenever that class is present. The choice is saved in localStorage so it
 * survives reloads; app/layout.js applies it before the page first paints.
 */
export default function ThemeToggle({ className = '' }) {
  // null until mounted — the server cannot know which theme the browser saved
  const [isDark, setIsDark] = useState(null)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggleTheme = () => {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      // Storage can be blocked (private mode); the theme still applies for this visit
    }
    setIsDark(next)
  }

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ${className}`}
    >
      {isDark === null ? (
        <span className="block h-5 w-5" />
      ) : isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
