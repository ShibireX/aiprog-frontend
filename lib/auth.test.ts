import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as auth from './auth'
import { graphqlClient } from './graphql/client'

// Mock GraphQL client
vi.mock('./graphql/client', () => {
  const setAuthToken = vi.fn()
  const removeAuthToken = vi.fn()
  const request = vi.fn()
  return {
    graphqlClient: { setAuthToken, removeAuthToken, request },
  }
})

// Mock query
vi.mock('./graphql/queries', () => ({
  GET_CURRENT_USER: `query GetCurrentUser {
    me {
      id
      email
      username
      thumbnailUrl
      createdAt
      updatedAt
    }
  }`,
}))

const testUser = {
  id: '1',
  email: 'someUser@example.com',
  name: 'someUser',
  thumbnailUrl: 'someUrl',
  createdAt: '2025-10-01',
  updatedAt: '2025-10-01',
} as any

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
})

describe('getStoredToken', () => {
  it('returns token from localStorage when stored', () => {
    localStorage.setItem('auth_token', 'someToken')
    expect(auth.getStoredToken()).toBe('someToken')
  })

  it('returns null if not stored', () => {
    expect(auth.getStoredToken()).toBeNull()
  })
})

describe('getAuthState', () => {
  it('return default state when not set', () => {
    const state = auth.getAuthState()
    expect(state).toEqual({
      isAuthenticated: false,
      user: null,
      token: null,
    })
  })

  it('token included when token stored', () => {
    localStorage.setItem('auth_token', 'someToken')
    const state = auth.getAuthState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBe('someToken')
  })
})

describe('validateToken', () => {
  it('returns user on success when token set', async () => {
    ;(graphqlClient.request as any).mockResolvedValue({ me: testUser })

    const user = await auth.validateToken('someToken')

    expect(graphqlClient.setAuthToken).toHaveBeenCalledWith('someToken')
    expect(graphqlClient.request).toHaveBeenCalledWith({
      query: expect.anything(), // GET_CURRENT_USER
      variables: {},
    })
    expect(user).toEqual(testUser)
  })
})

describe('logout', () => {
  it('removes token on logout', () => {
    localStorage.setItem('auth_token', 'someToken')
    auth.logout()
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect(graphqlClient.removeAuthToken).toHaveBeenCalledTimes(1)
  })
})
