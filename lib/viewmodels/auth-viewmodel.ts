'use client'

import type { User } from '@/types'
import { getAuthState, logout as logoutUtil, validateToken } from '@/lib/auth'

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  isCheckingAuth: boolean
  isUploadingThumbnail: boolean
  uploadError: string | null
  isDraggingOverAvatar: boolean
}

export class AuthViewModel {
  private state: AuthState
  private setState: (state: AuthState) => void

  constructor(initialState: AuthState, setState: (state: AuthState) => void) {
    this.state = initialState
    this.setState = setState
  }

  // Getters
  get isAuthenticated() {
    return this.state.isAuthenticated
  }
  get user() {
    return this.state.user
  }
  get token() {
    return this.state.token
  }
  get isCheckingAuth() {
    return this.state.isCheckingAuth
  }
  get isUploadingThumbnail() {
    return this.state.isUploadingThumbnail
  }
  get uploadError() {
    return this.state.uploadError
  }
  get isDraggingOverAvatar() {
    return this.state.isDraggingOverAvatar
  }

  // Actions
  checkAuthStatus = async () => {
    // Set loading state
    this.updateState({ isCheckingAuth: true })
    
    const authState = getAuthState()

    if (authState.token) {
      // We have a token, validate it
      const user = await validateToken(authState.token)

      if (user) {
        // Token is valid, user is authenticated
        this.updateState({
          isAuthenticated: true,
          user,
          token: authState.token,
          isCheckingAuth: false,
        })
      } else {
        // Token is invalid, clear state
        this.updateState({
          isAuthenticated: false,
          user: null,
          token: null,
          isCheckingAuth: false,
        })
      }
    } else {
      // No token, user is not authenticated
      this.updateState({
        ...authState,
        isCheckingAuth: false,
      })
    }
  }

  logout = () => {
    logoutUtil()
    this.updateState({
      isAuthenticated: false,
      user: null,
      token: null,
    })
  }

  uploadThumbnail = async (file: File): Promise<void> => {
    if (!this.state.token) {
      this.updateState({ uploadError: 'Not authenticated' })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.updateState({ uploadError: 'File size must be less than 5MB' })
      return
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ]
    if (!allowedTypes.includes(file.type)) {
      this.updateState({
        uploadError: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP',
      })
      return
    }

    this.updateState({ isUploadingThumbnail: true, uploadError: null })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
      const response = await fetch(`${apiBaseUrl}/api/upload-thumbnail`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()

      // Update user state with new thumbnail URL
      // Add cache-busting query parameter to force browser to reload the image
      const thumbnailUrlWithCacheBust = `${data.thumbnailUrl}?t=${Date.now()}`

      if (this.state.user) {
        this.updateState({
          user: {
            ...this.state.user,
            thumbnailUrl: thumbnailUrlWithCacheBust,
          },
          isUploadingThumbnail: false,
        })
      }
    } catch (error) {
      this.updateState({
        isUploadingThumbnail: false,
        uploadError: error instanceof Error ? error.message : 'Upload failed',
      })
    }
  }

  clearUploadError = () => {
    this.updateState({ uploadError: null })
  }

  handleAvatarDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!this.state.isUploadingThumbnail) {
      this.updateState({ isDraggingOverAvatar: true })
    }
  }

  handleAvatarDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    this.updateState({ isDraggingOverAvatar: false })
  }

  handleAvatarDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    this.updateState({ isDraggingOverAvatar: false })

    // Prevent multiple uploads at once
    if (this.state.isUploadingThumbnail) {
      return
    }

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      const file = files[0]
      // Check if it's an image file
      const acceptedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
      ]
      if (acceptedTypes.includes(file.type)) {
        await this.uploadThumbnail(file)
      } else {
        this.updateState({
          uploadError:
            'Invalid file type. Please drop an image file (JPEG, PNG, GIF, WebP)',
        })
      }
    }
  }

  private updateState = (partial: Partial<AuthState>) => {
    this.state = { ...this.state, ...partial }
    this.setState(this.state)
  }
}

// Hook for React - now exported from viewmodel-provider
// This is kept here for backward compatibility but re-exports from the provider
export { useAuthViewModel } from './viewmodel-provider'
