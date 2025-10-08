interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{
      line: number
      column: number
    }>
    path?: string[]
  }>
}

interface GraphQLRequest {
  query: string
  variables?: Record<string, any>
  operationName?: string
}

class GraphQLClient {
  private endpoint: string
  private headers: Record<string, string>

  constructor(endpoint: string, headers: Record<string, string> = {}) {
    this.endpoint = endpoint
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    }
  }

  async request<T>(request: GraphQLRequest): Promise<T> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: GraphQLResponse<T> = await response.json()

      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors[0].message)
      }

      if (!result.data) {
        throw new Error('No data returned from GraphQL endpoint')
      }

      return result.data
    } catch (error) {
      console.error('GraphQL request failed:', error)
      throw error
    }
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken() {
    delete this.headers['Authorization']
  }
}

// Create a singleton instance
const createGraphQLClient = () => {
  const endpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql'
  return new GraphQLClient(endpoint)
}

export const graphqlClient = createGraphQLClient()
export type { GraphQLRequest, GraphQLResponse }
