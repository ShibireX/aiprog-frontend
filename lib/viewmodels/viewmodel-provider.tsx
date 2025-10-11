'use client'

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { AuthViewModel, type AuthState } from './auth-viewmodel'
import { SearchViewModel } from './search-viewmodel'
import { DashboardViewModel } from './dashboard-viewmodel'
import type { SearchState } from '@/types/search'
import type { DashboardState } from '@/types/dashboard'

interface ViewModelContextType {
  authViewModel: AuthViewModel
  searchViewModel: SearchViewModel
  dashboardViewModel: DashboardViewModel
  // Add a render key to force updates
  _renderKey: number
}

const ViewModelContext = createContext<ViewModelContextType | null>(null)

export function ViewModelProvider({ children }: { children: ReactNode }) {
  // Render counter to force context consumers to re-render
  const [renderKey, setRenderKey] = useState(0)

  // Auth ViewModel State
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isUploadingThumbnail: false,
    uploadError: null,
  })

  // Wrap setState to increment render key on every state change
  const wrappedSetAuthState = (newState: AuthState) => {
    setAuthState(newState)
    setRenderKey(k => k + 1)
  }

  // Search ViewModel State
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filters: {},
    results: null,
    isLoading: false,
    error: null,
    savedPapers: new Set<string>(),
    savingPapers: new Set<string>(),
    folders: [],
    isSelectingFolder: false,
    selectedPaperToSave: null,
    newFolderName: '',
  })

  const wrappedSetSearchState = (newState: SearchState) => {
    setSearchState(newState)
    setRenderKey(k => k + 1)
  }

  // Dashboard ViewModel State
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    folders: [],
    savedPapers: [],
    uncategorizedCount: 0,
    isLoading: false,
    isLoadingFolders: false,
    error: null,
    filters: {
      limit: 10,
      offset: 0,
      selectedFolderId: null,
    },
    hasMore: false,
    isAddMapOpen: false,
    newMapName: '',
  })

  const wrappedSetDashboardState = (newState: DashboardState) => {
    setDashboardState(newState)
    setRenderKey(k => k + 1)
  }

  // Create viewmodel instances - these get recreated on each render with fresh state
  // Similar to the original pattern in individual viewmodel hooks
  const authViewModel = useRef(
    new AuthViewModel(authState, wrappedSetAuthState)
  )
  const searchViewModel = useRef(
    new SearchViewModel(
      searchState,
      wrappedSetSearchState,
      authViewModel.current
    )
  )
  const dashboardViewModel = useRef(
    new DashboardViewModel(
      dashboardState,
      wrappedSetDashboardState,
      authViewModel.current
    )
  )

  // Update the refs with new instances that have current state
  authViewModel.current = new AuthViewModel(authState, wrappedSetAuthState)
  searchViewModel.current = new SearchViewModel(
    searchState,
    wrappedSetSearchState,
    authViewModel.current
  )
  dashboardViewModel.current = new DashboardViewModel(
    dashboardState,
    wrappedSetDashboardState,
    authViewModel.current
  )

  // Create the context value with current viewmodel instances
  // Include renderKey to ensure context consumers re-render on every state change
  const contextValue = {
    authViewModel: authViewModel.current,
    searchViewModel: searchViewModel.current,
    dashboardViewModel: dashboardViewModel.current,
    _renderKey: renderKey,
  }

  // Check auth status on mount only
  const hasCheckedAuth = useRef(false)
  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true
      authViewModel.current.checkAuthStatus()
    }
  }, [])

  // Auto-load saved paper IDs and folders when authenticated (for search)
  const prevAuthStatus = useRef<boolean>(false)
  useEffect(() => {
    if (authState.isAuthenticated && !prevAuthStatus.current) {
      prevAuthStatus.current = true
      searchViewModel.current.loadSavedPaperIds()
      searchViewModel.current.loadFolders()
    } else if (!authState.isAuthenticated && prevAuthStatus.current) {
      prevAuthStatus.current = false
    }
  }, [authState.isAuthenticated])

  // Auto-load folders and papers when authenticated (for dashboard)
  const prevAuthStatusDashboard = useRef<boolean>(false)
  useEffect(() => {
    if (authState.isAuthenticated && !prevAuthStatusDashboard.current) {
      prevAuthStatusDashboard.current = true
      dashboardViewModel.current.loadFolders()
      dashboardViewModel.current.loadSavedPapers(true)
    } else if (!authState.isAuthenticated && prevAuthStatusDashboard.current) {
      prevAuthStatusDashboard.current = false
    }
  }, [authState.isAuthenticated])

  // Sync folders between search and dashboard viewmodels
  // When folders change in one viewmodel, reload in the other to keep them in sync
  const lastSearchFolderHash = useRef<string>('')
  const lastDashboardFolderHash = useRef<string>('')
  const isSyncingFolders = useRef<boolean>(false)

  useEffect(() => {
    if (!authState.isAuthenticated || isSyncingFolders.current) return

    // Create a hash of folder data including IDs and paper counts to detect any changes
    const searchFolderHash = searchState.folders
      .map(f => `${f.id}:${f.paperCount}:${f.updatedAt}`)
      .sort()
      .join('|')
    const dashboardFolderHash = dashboardState.folders
      .map(f => `${f.id}:${f.paperCount}:${f.updatedAt}`)
      .sort()
      .join('|')

    // If search folders changed, reload dashboard folders
    if (
      searchFolderHash !== lastSearchFolderHash.current &&
      searchState.folders.length > 0 &&
      searchFolderHash !== dashboardFolderHash
    ) {
      lastSearchFolderHash.current = searchFolderHash
      isSyncingFolders.current = true

      // Reload dashboard folders to get proper uncategorizedCount
      dashboardViewModel.current.loadFolders().finally(() => {
        isSyncingFolders.current = false
        // Also update search with the refreshed data
        lastDashboardFolderHash.current = searchFolderHash
      })
    }
    // If dashboard folders changed, reload search folders
    else if (
      dashboardFolderHash !== lastDashboardFolderHash.current &&
      dashboardState.folders.length > 0 &&
      dashboardFolderHash !== searchFolderHash
    ) {
      lastDashboardFolderHash.current = dashboardFolderHash
      isSyncingFolders.current = true

      // Reload search folders
      searchViewModel.current.loadFolders().finally(() => {
        isSyncingFolders.current = false
        lastSearchFolderHash.current = dashboardFolderHash
      })
    }
  }, [searchState.folders, dashboardState.folders, authState.isAuthenticated])

  return (
    <ViewModelContext.Provider value={contextValue}>
      {children}
    </ViewModelContext.Provider>
  )
}

export function useViewModelContext() {
  const context = useContext(ViewModelContext)
  if (!context) {
    throw new Error(
      'useViewModelContext must be used within a ViewModelProvider'
    )
  }
  return context
}

// Convenience hooks for individual viewmodels
export function useAuthViewModel(): AuthViewModel {
  return useViewModelContext().authViewModel
}

export function useSearchViewModel(): SearchViewModel {
  return useViewModelContext().searchViewModel
}

export function useDashboardViewModel(): DashboardViewModel {
  return useViewModelContext().dashboardViewModel
}
