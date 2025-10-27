'use client'

import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  mounted: boolean
}

export class ThemeViewModel {
  private state: ThemeState
  private setState: (state: ThemeState) => void

  constructor(initialState: ThemeState, setState: (state: ThemeState) => void) {
    this.state = initialState
    this.setState = setState
  }

  get theme() {
    return this.state.theme
  }

  get isDark() {
    return this.state.theme === 'dark'
  }

  get mounted() {
    return this.state.mounted
  }

  initialize = () => {
    if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark')
      this.updateState({ 
        theme: isDark ? 'dark' : 'light',
        mounted: true 
      })
    }
  }

  toggleTheme = async () => {
    const nextTheme: Theme = this.state.theme === 'dark' ? 'light' : 'dark'
    
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    }
    
    this.updateState({ theme: nextTheme })

    await this.persistTheme(nextTheme)
  }

  private persistTheme = async (theme: Theme): Promise<void> => {
    try {
      await fetch('/api/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      })
    } catch (error) {
      console.error('Failed to persist theme preference:', error)
    }
  }

  private updateState = (partial: Partial<ThemeState>) => {
    this.state = { ...this.state, ...partial }
    this.setState(this.state)
  }
}

export function useThemeViewModel() {
  const [state, setState] = useState<ThemeState>({
    theme: 'light',
    mounted: false,
  })

  const viewModel = new ThemeViewModel(state, setState)

  useEffect(() => {
    viewModel.initialize()
  }, [])

  return viewModel
}

