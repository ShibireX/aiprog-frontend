'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type {
  RegisterResponse,
  LoginResponse,
  AuthState,
  AuthMode,
} from '@/types/signup'
import { graphqlClient } from '@/lib/graphql/client'
import { REGISTER_USER, LOGIN_USER } from '../graphql/queries'

export class AuthFormViewModel {
  private state: AuthState
  private setState: (state: AuthState) => void
  private router?: ReturnType<typeof useRouter>

  constructor(
    initialState: AuthState,
    setState: (state: AuthState) => void,
    router?: ReturnType<typeof useRouter>
  ) {
    this.state = initialState
    this.setState = setState
    this.router = router
  }

  // Getters
  get mode() {
    return this.state.mode
  }
  get username() {
    return this.state.username
  }
  get email() {
    return this.state.email
  }
  get password() {
    return this.state.password
  }
  get repeatPassword() {
    return this.state.repeatPassword
  }
  get isSubmitting() {
    return this.state.isSubmitting
  }
  get errorMessage() {
    return this.state.errorMessage
  }
  get fieldErrors() {
    return this.state.fieldErrors
  }

  // Mode switching
  setMode = (mode: AuthMode) => {
    this.updateState({
      mode,
      errorMessage: null,
      fieldErrors: {},
    })
  }

  // Field actions with validation
  setUsername = (username: string) => {
    this.updateState({
      username,
      fieldErrors: { ...this.state.fieldErrors, username: undefined },
    })
  }

  setEmail = (email: string) => {
    this.updateState({
      email,
      fieldErrors: { ...this.state.fieldErrors, email: undefined },
    })
  }

  setPassword = (password: string) => {
    this.updateState({
      password,
      fieldErrors: { ...this.state.fieldErrors, password: undefined },
    })
  }

  setRepeatPassword = (repeatPassword: string) => {
    this.updateState({
      repeatPassword,
      fieldErrors: { ...this.state.fieldErrors, repeatPassword: undefined },
    })
  }

  // Validation methods
  private validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Please enter a valid email address'
    return undefined
  }

  private validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return undefined
  }

  private validateUsername = (username: string): string | undefined => {
    if (!username.trim()) return 'Username is required'
    if (username.length < 3) return 'Username must be at least 3 characters'
    return undefined
  }

  private validateRepeatPassword = (
    password: string,
    repeatPassword: string
  ): string | undefined => {
    if (!repeatPassword) return 'Please confirm your password'
    if (password !== repeatPassword) return 'Passwords do not match'
    return undefined
  }

  private validateForm = (): boolean => {
    const errors: typeof this.state.fieldErrors = {}

    if (this.state.mode === 'signup') {
      errors.username = this.validateUsername(this.state.username)
      errors.repeatPassword = this.validateRepeatPassword(
        this.state.password,
        this.state.repeatPassword
      )
    }

    errors.email = this.validateEmail(this.state.email)
    errors.password = this.validatePassword(this.state.password)

    const hasErrors = Object.values(errors).some(error => error !== undefined)

    if (hasErrors) {
      this.updateState({ fieldErrors: errors })
      return false
    }

    return true
  }

  onSubmit = async () => {
    // Clear previous errors
    this.updateState({
      isSubmitting: true,
      errorMessage: null,
      fieldErrors: {},
    })

    // Validate form
    if (!this.validateForm()) {
      this.updateState({ isSubmitting: false })
      return
    }

    try {
      if (this.state.mode === 'signup') {
        const result = await this.registerUserAPI(
          this.username,
          this.email,
          this.password
        )
        this.handleAuthSuccess(result.token, result.user)
      } else {
        const result = await this.loginUserAPI(this.email, this.password)
        this.handleAuthSuccess(result.token, result.user)
      }
    } catch (err: any) {
      this.updateState({
        isSubmitting: false,
        errorMessage:
          err.message ||
          `${this.state.mode === 'signup' ? 'Signup' : 'Login'} failed`,
      })
    }
  }

  private handleAuthSuccess = (token: string, _user: any) => {
    // Set token for GraphQL client
    graphqlClient.setAuthToken?.(token)

    // Persist token for future sessions
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }

    this.updateState({ isSubmitting: false })

    // Redirect to home page after successful authentication
    this.router?.push('/')
  }

  private registerUserAPI = async (
    username: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> => {
    const variables = {
      input: {
        username: username,
        email: email,
        password: password,
      },
    }

    const response = await graphqlClient.request<{
      register: RegisterResponse
    }>({
      query: REGISTER_USER,
      variables,
    })
    return response.register
  }

  private loginUserAPI = async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const variables = {
      input: { email, password },
    }
    const response = await graphqlClient.request<{ login: LoginResponse }>({
      query: LOGIN_USER,
      variables,
    })
    return response.login
  }

  private updateState = (partial: Partial<AuthState>) => {
    this.state = { ...this.state, ...partial }
    this.setState(this.state)
  }
}

// Hook for React
export function useAuthFormViewModel(initialMode: AuthMode = 'signup') {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    mode: initialMode,
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    isSubmitting: false,
    errorMessage: null,
    fieldErrors: {},
  })

  const viewModel = useRef(new AuthFormViewModel(state, setState, router))
  viewModel.current = new AuthFormViewModel(state, setState, router)

  return viewModel.current
}

// Backward compatibility
export const useSignUpViewModel = () => useAuthFormViewModel('signup')
