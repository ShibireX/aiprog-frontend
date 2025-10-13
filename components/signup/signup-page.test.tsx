import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import React from 'react'

vi.mock('@/lib/viewmodels/signup-viewmodel', () => ({
  useAuthFormViewModel: vi.fn(),
}))

vi.mock('lucide-react', () => ({
  UserPlus: (p: any) => <div data-testid="icon-userplus" {...p} />,
  LogIn: (p: any) => <div data-testid="icon-login" {...p} />,
  Eye: (p: any) => <div data-testid="icon-eye" {...p} />, // Used by ui/sign-up (the AuthForm)
  EyeOff: (p: any) => <div data-testid="icon-eyeoff" {...p} />, // Used by ui/sign-up (the AuthForm)
}))

import { useAuthFormViewModel } from '@/lib/viewmodels/signup-viewmodel'
import { AuthView } from './signup-page'

function makeVM(overrides: Partial<ReturnType<typeof baseVM>> = {}) {
  return { ...baseVM(), ...overrides }
}
function baseVM() {
  return {
    mode: 'signup' as 'signup' | 'signin',
    username: 'someUser',
    email: 'someUser@example.com',
    password: 'secret',
    repeatPassword: 'secret',
    isSubmitting: false,
    errorMessage: '',
    fieldErrors: {},
    setMode: vi.fn(),
    setUsername: vi.fn(),
    setEmail: vi.fn(),
    setPassword: vi.fn(),
    setRepeatPassword: vi.fn(),
    onSubmit: vi.fn(),
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('<AuthView />', () => {
  it('renders correct info on sign up', () => {
    ;(useAuthFormViewModel as unknown as Mock).mockReturnValue(
      makeVM({ mode: 'signup' })
    )
    render(<AuthView />)

    expect(
      screen.getByRole('heading', { name: /create an account/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/sign up to get started/i)).toBeInTheDocument()
    expect(screen.getByTestId('icon-userplus')).toBeInTheDocument()
    expect(screen.queryByTestId('icon-login')).not.toBeInTheDocument()
  })

  it('renders currect info on sign in', () => {
    ;(useAuthFormViewModel as unknown as Mock).mockReturnValue(
      makeVM({ mode: 'signin' })
    )
    render(<AuthView />)

    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/sign in to continue/i)).toBeInTheDocument()
    expect(screen.getByTestId('icon-login')).toBeInTheDocument()
    expect(screen.queryByTestId('icon-userplus')).not.toBeInTheDocument()
  })
})
