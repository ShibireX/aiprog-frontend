import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import React from 'react'

vi.mock('@/lib/viewmodels/search-viewmodel', () => ({
  useSearchViewModel: vi.fn(),
}))

import { useSearchViewModel } from '@/lib/viewmodels/search-viewmodel'
import { SearchPage } from './search-page'

vi.mock('@/components/ui/button', () => ({
  Button: ({ description, link }: any) => (
    <a data-testid="signup-button" href={link}>
      {description}
    </a>
  ),
}))
vi.mock('@/components/ui/user-avatar', () => ({
  UserAvatar: () => <div data-testid="user-avatar" />,
}))
vi.mock('../ui/theme-switch', () => ({
  ThemeSwitch: () => <div data-testid="theme-switch" />,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

function makeVM(overrides: Partial<any> = {}) {
  return {
    auth: { isAuthenticated: false },
    query: '',
    isLoading: false,
    error: '',
    results: null as any,
    setQuery: vi.fn(),
    performSearch: vi.fn(),
    ...overrides,
  }
}

describe('<SearchPage />', () => {
  it('shows sign up button when not authenticated', () => {
    ;(useSearchViewModel as unknown as Mock).mockReturnValue(
      makeVM({ auth: { isAuthenticated: false } })
    )
    render(<SearchPage />)

    expect(screen.getByTestId('signup-button')).toBeInTheDocument()
    expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('theme-switch')).not.toBeInTheDocument()
  })

  it('shows avatar and theme switch when authenticated', () => {
    ;(useSearchViewModel as unknown as Mock).mockReturnValue(
      makeVM({ auth: { isAuthenticated: true } })
    )
    render(<SearchPage />)

    expect(screen.getByTestId('theme-switch')).toBeInTheDocument()
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument()
    expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument()
  })
})
