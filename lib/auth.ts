'use client'

import type { User } from '@/types'
import { graphqlClient } from './graphql/client'
import { GET_CURRENT_USER } from './graphql/queries'

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem('auth_token')
}

export function getAuthState(): AuthState {
  const token = getStoredToken()

  if (!token) {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
    }
  }

  // Token exists but we don't know if it's valid yet
  // This will be validated by the auth viewmodel
  return {
    isAuthenticated: false, // Will be set to true after validation
    user: null, // Will be set after validation
    token,
  }
}

export async function validateToken(token: string): Promise<User | null> {
  try {
    // Set token in client for this request
    graphqlClient.setAuthToken?.(token)

    const response = await graphqlClient.request<{ me: User }>({
      query: GET_CURRENT_USER,
      variables: {},
    })

    return response.me
  } catch (error) {
    console.error('Token validation failed:', error)
    // Clear invalid token
    logout()
    return null
  }
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
  // Set token in GraphQL client
  graphqlClient.setAuthToken?.(token)
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
  // Clear token from GraphQL client
  graphqlClient.removeAuthToken?.()
}
