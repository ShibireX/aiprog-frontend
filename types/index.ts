// Global type definitions for Papr application

export interface User {
  id: string
  email: string
  username: string
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Example component props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// Export search-related types
export type {
  Tldr,
  Paper,
  SearchFilters,
  SearchResult,
  SearchState,
} from './search'
