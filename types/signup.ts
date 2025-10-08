import { User } from '.'

export type AuthMode = 'login' | 'signup'

export interface AuthState {
  mode: AuthMode
  username: string
  email: string
  password: string
  repeatPassword: string
  isSubmitting: boolean
  errorMessage?: string | null
  fieldErrors: {
    username?: string
    email?: string
    password?: string
    repeatPassword?: string
  }
}

export interface RegisterResponse {
  token: string
  user: User
}

export interface LoginResponse {
  token: string
  user: User
}
