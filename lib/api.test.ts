import { describe, it, expect, beforeEach, vi } from 'vitest'

type FetchMock = ReturnType<typeof vi.fn>

function mockFetchOk(body: any): FetchMock {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => body,
  } as any)
}

function mockFetchErr(status: number, body: any): FetchMock {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => body,
  } as any)
}

async function loadApiModule() {
  vi.resetModules()
  return await import('./api')
}

beforeEach(() => {
  vi.restoreAllMocks()
  // Clear env var between tests
  delete (process.env as any).NEXT_PUBLIC_API_URL
})

describe('apiRequest', () => {
  it('returns data for 200 OK', async () => {
    const data = { someKey: 'someValue' }
    const fetch = mockFetchOk(data)
    vi.stubGlobal('fetch', fetch)

    const { apiRequest } = await loadApiModule()
    const res = await apiRequest('/ping')

    expect(res).toEqual({ data })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('returns error form non-OK with fallback message', async () => {
    const fetch = mockFetchErr(404, { not: 'used' })
    vi.stubGlobal('fetch', fetch)

    const { apiRequest } = await loadApiModule()
    const res = await apiRequest('/missing')

    expect(res.error).toBe('HTTP error! status: 404') // From api fucntion
  })
})
