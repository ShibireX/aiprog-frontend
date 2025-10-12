'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeSwitch() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
    setMounted(true)
  }, [])

  const toggle = async () => {
    const next = isDark ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    setIsDark(next === 'dark')

    // Persist theme preference via frontend API route (sets cookie)
    try {
      await fetch('/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: next }),
      })
    } catch (error) {
      console.error('Failed to persist theme preference:', error)
    }
  }

  return (
    <button
      onClick={toggle}
      className={`group relative inline-flex h-10 w-20 items-center rounded-full bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 ${
        mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      aria-label="Toggle theme"
    >
      {/* Toggle slider */}
      <span
        className={`inline-flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ${
          isDark ? 'translate-x-11' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-gray-800" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </span>

      {/* Background icons */}
      <span className="absolute left-3 flex items-center">
        <Sun
          className={`h-4 w-4 transition-opacity duration-300 ${
            isDark ? 'opacity-40' : 'opacity-0'
          }`}
        />
      </span>
      <span className="absolute right-3 flex items-center">
        <Moon
          className={`h-4 w-4 transition-opacity duration-300 ${
            isDark ? 'opacity-0' : 'opacity-40'
          }`}
        />
      </span>
    </button>
  )
}
