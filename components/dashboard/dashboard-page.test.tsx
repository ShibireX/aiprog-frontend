import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'

vi.mock('@/lib/viewmodels/auth-viewmodel', () => ({
  useAuthViewModel: vi.fn(),
}))
vi.mock('@/lib/viewmodels/dashboard-viewmodel', () => ({
  useDashboardViewModel: vi.fn(),
}))
vi.mock('@/lib/viewmodels/citation-viewmodel', () => ({
  useCitationViewModel: vi.fn(),
}))

vi.mock('next/image', () => ({ default: (p: any) => <img {...p} alt={p.alt || ''} /> }))
vi.mock('@/components/ui/citation-popup', () => ({
  CitationPopup: () => <div />,
}))

vi.mock('../ui/search-bar', () => ({ SearchBar: () => <div /> }))
vi.mock('../ui/icon-button', () => ({ IconButton: () => <div /> }))

import { useAuthViewModel } from '@/lib/viewmodels/auth-viewmodel'
import { useDashboardViewModel } from '@/lib/viewmodels/dashboard-viewmodel'
import { useCitationViewModel } from '@/lib/viewmodels/citation-viewmodel'
import { DashboardView } from './dashboard-page'

function authVM(overrides: Partial<any> = {}) {
  return {
    user: {
      username: 'someUser',
      email: 'someUser@example.com',
      thumbnailUrl: 'someUrl',
    },
    isUploadingThumbnail: false,
    uploadError: '',
    uploadThumbnail: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  }
}

function dashVM(overrides: Partial<any> = {}) {
  return {
    selectedFolderId: null,
    selectedFolder: null,
    folders: [],
    uncategorizedCount: 2,
    setSelectedFolder: vi.fn(),
    openAddMapModal: vi.fn(),
    isAddMapOpen: false,
    closeAddMapModal: vi.fn(),
    newMapName: '',
    setNewMapName: vi.fn(),
    createMap: vi.fn(),

    savedPapers: [],
    filteredSavedPapers: [],
    isLoading: false,
    error: '',
    clearError: vi.fn(),

    filters: { searchQuery: '' },
    setSearchQuery: vi.fn(),
    ...overrides,
  }
}

function citeVM(overrides: Partial<any> = {}) {
  return {
    openPopup: vi.fn(),
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('<DashboardView />', () => {
  it('clicking Logout calls logout and redirects to start', () => {
    ;(useAuthViewModel as any).mockReturnValue(authVM())
    ;(useDashboardViewModel as any).mockReturnValue(dashVM())
    ;(useCitationViewModel as any).mockReturnValue(citeVM())

    // make window.location.href writable & observable
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, href: 'http://localhost/' },
      writable: true,
    })

    render(<DashboardView />)

    fireEvent.click(screen.getByRole('button', { name: /logout/i }))

    expect(useAuthViewModel().logout).toHaveBeenCalled()
    expect(window.location.href).toBe('/')
  })

  it('bulk citation button shows for >1 papers and calls openPopup with the list', () => {
    const papers = [
      { id: 'a', paper: { title: 'A', authors: [] } },
      { id: 'b', paper: { title: 'B', authors: [] } },
    ]
    const cVM = citeVM()
    ;(useAuthViewModel as any).mockReturnValue(authVM())
    ;(useDashboardViewModel as any).mockReturnValue(
      dashVM({ filteredSavedPapers: papers })
    )
    ;(useCitationViewModel as any).mockReturnValue(cVM)

    render(<DashboardView />)

    const btn = screen.getByRole('button', { name: /bulk citation/i })
    expect(btn).toBeInTheDocument()

    fireEvent.click(btn)
    expect(cVM.openPopup).toHaveBeenCalledWith(papers)
  })
})
