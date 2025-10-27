'use client'
import { Moon, Sun } from 'lucide-react'
import { useThemeViewModel } from '@/lib/viewmodels/theme-viewmodel'

export function ThemeSwitch() {
  const viewModel = useThemeViewModel()

  return (
    <button
      onClick={viewModel.toggleTheme}
      className={`group relative inline-flex h-10 w-20 items-center rounded-full bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 ${
        viewModel.mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
      aria-label="Toggle theme"
    >
      {/* Toggle slider */}
      <span
        className={`inline-flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ${
          viewModel.isDark ? 'translate-x-11' : 'translate-x-1'
        }`}
      >
        {viewModel.isDark ? (
          <Moon className="h-4 w-4 text-gray-800" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </span>

      {/* Background icons */}
      <span className="absolute left-3 flex items-center">
        <Sun
          className={`h-4 w-4 transition-opacity duration-300 ${
            viewModel.isDark ? 'opacity-40' : 'opacity-0'
          }`}
        />
      </span>
      <span className="absolute right-3 flex items-center">
        <Moon
          className={`h-4 w-4 transition-opacity duration-300 ${
            viewModel.isDark ? 'opacity-0' : 'opacity-40'
          }`}
        />
      </span>
    </button>
  )
}
