// Global type definitions examples - adjust later

export interface User {
  id: string
  name: string
  email: string
  image?: string
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
