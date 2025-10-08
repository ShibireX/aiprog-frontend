'use client'

import type { DashboardState, DashboardFilters } from '@/types/dashboard'
import type { SavedPaper, Folder } from '@/types/search'
import { graphqlClient } from '@/lib/graphql/client'
import {
  GET_SAVED_PAPERS,
  GET_FOLDERS,
  CREATE_FOLDER,
  UPDATE_FOLDER,
  DELETE_FOLDER,
  MOVE_PAPER_TO_FOLDER,
  UNSAVE_PAPER,
} from '@/lib/graphql/queries'
import type { AuthViewModel } from './auth-viewmodel'

export class DashboardViewModel {
  private state: DashboardState
  private setState: (state: DashboardState) => void
  public auth: AuthViewModel

  constructor(
    initialState: DashboardState,
    setState: (state: DashboardState) => void,
    authViewModel: AuthViewModel
  ) {
    this.state = initialState
    this.setState = setState
    this.auth = authViewModel
  }

  // Getters
  get folders() {
    return this.state.folders
  }

  get savedPapers() {
    return this.state.savedPapers
  }

  get isLoading() {
    return this.state.isLoading
  }

  get isLoadingFolders() {
    return this.state.isLoadingFolders
  }

  get error() {
    return this.state.error
  }

  get filters() {
    return this.state.filters
  }

  get total() {
    return this.state.total
  }

  get hasMore() {
    return this.state.hasMore
  }

  get selectedFolderId() {
    return this.state.filters.selectedFolderId
  }

  get selectedFolder() {
    if (!this.state.filters.selectedFolderId) return null
    return (
      this.state.folders.find(
        f => f.id === this.state.filters.selectedFolderId
      ) || null
    )
  }

  get isAddMapOpen() {
    return this.state.isAddMapOpen
  }

  get newMapName() {
    return this.state.newMapName
  }

  get uncategorizedCount() {
    return this.state.uncategorizedCount
  }

  get filteredSavedPapers() {
    let papers = this.state.savedPapers

    // Filter by search query
    const query = (this.state.filters.searchQuery || '').trim().toLowerCase()
    if (query) {
      papers = papers.filter(sp => {
        const paper = sp.paper
        const searchableText = [
          paper.title,
          paper.authors.join(' '),
          paper.abstract || '',
          paper.venue || '',
          paper.year?.toString() || '',
        ]
          .join(' ')
          .toLowerCase()
        return searchableText.includes(query)
      })
    }

    return papers
  }

  // Actions
  loadFolders = async () => {
    if (!this.auth.isAuthenticated) {
      return
    }

    this.updateState({ isLoadingFolders: true, error: null })

    try {
      const folders = await this.getFoldersAPI()

      // Calculate total paper count: uncategorized papers + all papers in folders
      const totalInFolders = folders.reduce(
        (sum, folder) => sum + folder.paperCount,
        0
      )
      const uncategorizedPapers = await this.getSavedPapersAPI(1000, 0, null)
      const allPapersCount = uncategorizedPapers.length + totalInFolders

      this.updateState({
        folders,
        uncategorizedCount: allPapersCount,
        isLoadingFolders: false,
      })
    } catch (error) {
      this.updateState({
        error:
          error instanceof Error ? error.message : 'Failed to load folders',
        isLoadingFolders: false,
      })
    }
  }

  loadSavedPapers = async (refresh: boolean = false) => {
    // Check if user is authenticated
    if (!this.auth.isAuthenticated) {
      this.updateState({ error: 'Please log in to view saved papers' })
      return
    }

    // If refreshing, reset the offset and clear existing papers
    const currentOffset = refresh ? 0 : this.state.savedPapers.length
    const currentPapers = refresh ? [] : this.state.savedPapers

    this.updateState({ isLoading: true, error: null })

    try {
      // Backend semantics:
      // - folderId omitted → return ALL papers across folders
      // - folderId = null  → return ONLY uncategorized papers
      // - folderId = string → return papers in that folder
      const selected = this.state.filters.selectedFolderId
      const folderIdForQuery = selected === null ? undefined : selected

      const result = await this.getSavedPapersAPI(
        this.state.filters.limit || 10,
        currentOffset,
        folderIdForQuery
      )

      // Combine with existing papers (for pagination) or replace (for refresh)
      const updatedPapers = refresh ? result : [...currentPapers, ...result]

      this.updateState({
        savedPapers: updatedPapers,
        isLoading: false,
        hasMore: result.length === (this.state.filters.limit || 10),
      })
    } catch (error) {
      this.updateState({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load saved papers',
        isLoading: false,
      })
    }
  }

  loadMorePapers = async () => {
    if (!this.state.hasMore || this.state.isLoading) return
    await this.loadSavedPapers(false)
  }

  refreshPapers = async () => {
    await this.loadSavedPapers(true)
  }

  setFilters = (filters: Partial<DashboardFilters>) => {
    const newFilters = { ...this.state.filters, ...filters }
    this.updateState({ filters: newFilters })
  }

  setSearchQuery = (searchQuery: string) => {
    this.setFilters({ searchQuery })
  }

  setSelectedFolder = (selectedFolderId: string | null) => {
    this.setFilters({ selectedFolderId })
    // Reload papers when folder changes
    this.loadSavedPapers(true)
  }

  openAddMapModal = () => {
    this.updateState({ isAddMapOpen: true, newMapName: '' })
  }

  closeAddMapModal = () => {
    this.updateState({ isAddMapOpen: false, newMapName: '' })
  }

  setNewMapName = (newMapName: string) => {
    this.updateState({ newMapName })
  }

  createMap = async () => {
    if (!this.state.newMapName.trim()) return

    try {
      const newFolder = await this.createFolderAPI(this.state.newMapName)
      this.updateState({
        folders: [...this.state.folders, newFolder],
        isAddMapOpen: false,
        newMapName: '',
      })

      // Refresh the total count
      await this.loadFolders()
    } catch (error) {
      this.updateState({
        error:
          error instanceof Error ? error.message : 'Failed to create folder',
      })
    }
  }

  deleteFolder = async (folderId: string) => {
    try {
      await this.deleteFolderAPI(folderId)

      // If we deleted the selected folder, switch to "All"
      if (this.state.filters.selectedFolderId === folderId) {
        this.setSelectedFolder(null)
      }

      // Refresh folders and total count
      await this.loadFolders()
    } catch (error) {
      this.updateState({
        error:
          error instanceof Error ? error.message : 'Failed to delete folder',
      })
    }
  }

  renameFolder = async (folderId: string, newName: string) => {
    try {
      const updatedFolder = await this.updateFolderAPI(folderId, newName)

      // Update folder in state
      const updatedFolders = this.state.folders.map(f =>
        f.id === folderId
          ? {
              ...f,
              name: updatedFolder.name,
              updatedAt: updatedFolder.updatedAt,
            }
          : f
      )
      this.updateState({ folders: updatedFolders })
    } catch (error) {
      this.updateState({
        error:
          error instanceof Error ? error.message : 'Failed to rename folder',
      })
    }
  }

  movePaperToFolder = async (savedPaperId: string, folderId: string | null) => {
    try {
      // Find the paper to get its paperId (not the savedPaper.id)
      const savedPaper = this.state.savedPapers.find(p => p.id === savedPaperId)
      if (!savedPaper) {
        throw new Error('Paper not found in saved papers')
      }

      // Use the paper ID (not the saved_papers row ID)
      await this.movePaperToFolderAPI(savedPaper.paperId, folderId)

      // Update paper in state
      const updatedPapers = this.state.savedPapers.map(p =>
        p.id === savedPaperId ? { ...p, folderId: folderId || undefined } : p
      )
      this.updateState({ savedPapers: updatedPapers })

      // Refresh folders and uncategorized count
      await this.loadFolders()
    } catch (error) {
      this.updateState({
        error: error instanceof Error ? error.message : 'Failed to move paper',
      })
    }
  }

  unsavePaper = async (savedPaperId: string) => {
    try {
      // Find the paper to get its paperId (not the savedPaper.id)
      const savedPaper = this.state.savedPapers.find(p => p.id === savedPaperId)
      if (!savedPaper) {
        throw new Error('Paper not found in saved papers')
      }

      // Use the paper ID (not the saved_papers row ID)
      await this.unsavePaperAPI(savedPaper.paperId)

      // Remove paper from state
      const updatedPapers = this.state.savedPapers.filter(
        p => p.id !== savedPaperId
      )
      this.updateState({ savedPapers: updatedPapers })

      // Refresh folders and uncategorized count
      await this.loadFolders()
    } catch (error) {
      this.updateState({
        error:
          error instanceof Error ? error.message : 'Failed to unsave paper',
      })
    }
  }

  clearError = () => {
    this.updateState({ error: null })
  }

  private updateState = (partial: Partial<DashboardState>) => {
    this.state = { ...this.state, ...partial }
    this.setState(this.state)
  }

  // GraphQL API calls
  private getFoldersAPI = async (): Promise<Folder[]> => {
    const response = await graphqlClient.request<{ getFolders: Folder[] }>({
      query: GET_FOLDERS,
    })

    return response.getFolders
  }

  private getSavedPapersAPI = async (
    limit: number,
    offset: number,
    folderId?: string | null
  ): Promise<SavedPaper[]> => {
    const variables: any = {
      limit,
      offset,
    }

    // Only include folderId if it's defined (not undefined)
    if (folderId !== undefined) {
      variables.folderId = folderId
    }

    const response = await graphqlClient.request<{
      getSavedPapers: SavedPaper[]
    }>({
      query: GET_SAVED_PAPERS,
      variables,
    })

    return response.getSavedPapers
  }

  private createFolderAPI = async (name: string): Promise<Folder> => {
    const variables = {
      input: { name },
    }

    const response = await graphqlClient.request<{ createFolder: Folder }>({
      query: CREATE_FOLDER,
      variables,
    })

    return response.createFolder
  }

  private updateFolderAPI = async (
    folderId: string,
    name: string
  ): Promise<Folder> => {
    const variables = {
      id: folderId,
      input: { name },
    }

    const response = await graphqlClient.request<{ updateFolder: Folder }>({
      query: UPDATE_FOLDER,
      variables,
    })

    return response.updateFolder
  }

  private deleteFolderAPI = async (folderId: string): Promise<boolean> => {
    const variables = { id: folderId }

    const response = await graphqlClient.request<{ deleteFolder: boolean }>({
      query: DELETE_FOLDER,
      variables,
    })

    return response.deleteFolder
  }

  private movePaperToFolderAPI = async (
    paperId: string,
    folderId: string | null
  ): Promise<SavedPaper> => {
    const variables = {
      paperId,
      folderId,
    }

    const response = await graphqlClient.request<{
      movePaperToFolder: SavedPaper
    }>({
      query: MOVE_PAPER_TO_FOLDER,
      variables,
    })

    return response.movePaperToFolder
  }

  private unsavePaperAPI = async (paperId: string): Promise<boolean> => {
    const variables = { paperId }

    const response = await graphqlClient.request<{ unsavePaper: boolean }>({
      query: UNSAVE_PAPER,
      variables,
    })

    return response.unsavePaper
  }
}

// Hook for React - now exported from viewmodel-provider
// This is kept here for backward compatibility but re-exports from the provider
export { useDashboardViewModel } from './viewmodel-provider'
