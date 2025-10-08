'use client';

import type { SearchState, SearchFilters, SearchResult, SavedPaper, Folder } from '@/types/search';
import { graphqlClient } from '@/lib/graphql/client';
import { SAVE_PAPER, UNSAVE_PAPER, SEARCH_PAPERS, GET_SAVED_PAPERS, GET_FOLDERS, CREATE_FOLDER, MOVE_PAPER_TO_FOLDER } from '@/lib/graphql/queries';
import type { AuthViewModel } from './auth-viewmodel';

export class SearchViewModel {
  private state: SearchState;
  private setState: (state: SearchState) => void;
  public auth: AuthViewModel;

  constructor(initialState: SearchState, setState: (state: SearchState) => void, authViewModel: AuthViewModel) {
    this.state = initialState;
    this.setState = setState;
    this.auth = authViewModel;
  }

  // Getters
  get query() {
    return this.state.query;
  }

  get filters() {
    return this.state.filters;
  }

  get results() {
    return this.state.results;
  }

  get isLoading() {
    return this.state.isLoading;
  }

  get error() {
    return this.state.error;
  }

  get savedPapers() {
    return this.state.savedPapers;
  }

  get savingPapers() {
    return this.state.savingPapers;
  }

  get folders() {
    return this.state.folders;
  }

  get isSelectingFolder() {
    return this.state.isSelectingFolder;
  }

  get selectedPaperToSave() {
    return this.state.selectedPaperToSave;
  }

  get newFolderName() {
    return this.state.newFolderName;
  }

  // Actions
  setQuery = (query: string) => {
    this.updateState({ query });
  };

  performSearch = async () => {
    if (!this.state.query.trim()) return;
    
    this.updateState({ isLoading: true, error: null });

    try {
      const result = await this.searchPapersAPI(this.state.query, this.state.filters);
      this.updateState({ results: result, isLoading: false });
    } catch (error) {
      this.updateState({
        error: error instanceof Error ? error.message : 'An error occurred during search',
        isLoading: false,
      });
    }
  };

  setFilters = (filters: Partial<SearchFilters>) => {
    const newFilters = { ...this.state.filters, ...filters };
    this.updateState({ filters: newFilters });
  };

  clearResults = () => {
    this.updateState({ results: null, error: null });
  };

  clearError = () => {
    this.updateState({ error: null });
  };

  loadSavedPaperIds = async () => {
    // Check if user is authenticated
    if (!this.auth.isAuthenticated) {
      return;
    }

    try {
      // Load all saved papers to get their IDs
      const savedPapers = await this.getSavedPapersAPI(1000, 0); // Get a large batch
      
      // Extract paper IDs and add to savedPapers set
      const savedPaperIds = new Set<string>();
      savedPapers.forEach(sp => {
        savedPaperIds.add(sp.paper.id);
      });
      
      this.updateState({ savedPapers: savedPaperIds });
    } catch (error) {
      // Silently fail - not critical for search functionality
      console.error('Failed to load saved paper IDs:', error);
    }
  };

  loadFolders = async () => {
    if (!this.auth.isAuthenticated) {
      return;
    }

    try {
      const folders = await this.getFoldersAPI();
      this.updateState({ folders });
    } catch (error) {
      console.error('Failed to load folders:', error);
    }
  };

  openFolderSelection = (paperId: string) => {
    this.updateState({ 
      isSelectingFolder: true, 
      selectedPaperToSave: paperId,
      newFolderName: ''
    });
  };

  closeFolderSelection = () => {
    this.updateState({ 
      isSelectingFolder: false, 
      selectedPaperToSave: null,
      newFolderName: ''
    });
  };

  setNewFolderName = (name: string) => {
    this.updateState({ newFolderName: name });
  };

  createFolderAndSave = async () => {
    if (!this.state.newFolderName.trim() || !this.state.selectedPaperToSave) {
      return;
    }

    try {
      // Create the folder
      const newFolder = await this.createFolderAPI(this.state.newFolderName);
      
      // Update folders list
      this.updateState({ 
        folders: [...this.state.folders, newFolder],
        newFolderName: ''
      });
      
      // Save paper to the new folder
      await this.savePaperToFolder(this.state.selectedPaperToSave, newFolder.id);
    } catch (error) {
      this.updateState({
        error: error instanceof Error ? error.message : 'Failed to create folder',
      });
    }
  };

  savePaperToFolder = async (paperId: string, folderId: string | null) => {
    const notes = '';
    const tags: string[] = [];
    
    // Close the modal
    this.closeFolderSelection();
    
    // Add to saving state
    const newSavingPapers = new Set(this.state.savingPapers);
    newSavingPapers.add(paperId);
    this.updateState({ savingPapers: newSavingPapers, error: null });

    try {
      // First, save the paper (paperId is the Semantic Scholar paper ID)
      const savedPaper = await this.savePaperAPI(paperId, notes, tags);
      
      // Then, if a folder was selected, move the paper to that folder
      // Use the savedPaper.paperId (the paper ID, not the saved_papers row ID)
      if (folderId) {
        await this.movePaperToFolderAPI(savedPaper.paperId, folderId);
      }
      
      // Add to saved papers and remove from saving
      const newSavedPapers = new Set(this.state.savedPapers);
      newSavedPapers.add(paperId);
      const updatedSavingPapers = new Set(this.state.savingPapers);
      updatedSavingPapers.delete(paperId);
      
      this.updateState({ 
        savedPapers: newSavedPapers,
        savingPapers: updatedSavingPapers
      });
      
      // Refresh folders to update counts
      await this.loadFolders();
    } catch (error) {
      // Remove from saving state on error
      const updatedSavingPapers = new Set(this.state.savingPapers);
      updatedSavingPapers.delete(paperId);
      
      console.error('Error saving paper to folder:', error);
      
      this.updateState({
        savingPapers: updatedSavingPapers,
        error: error instanceof Error ? error.message : 'Failed to save paper'
      });
    }
  };

  savePaper = async (paperId: string) => {
    // Check if user is authenticated
    if (!this.auth.isAuthenticated) {
      this.updateState({ error: 'Please log in to save papers' });
      return;
    }

    // Check if paper is already saved
    if (this.state.savedPapers.has(paperId)) {
      return; // Already saved
    }

    // Open folder selection modal
    this.openFolderSelection(paperId);
  };

  unsavePaper = async (paperId: string) => {
    // Check if user is authenticated
    if (!this.auth.isAuthenticated) {
      this.updateState({ error: 'Please log in to manage papers' });
      return;
    }

    try {
      await this.unsavePaperAPI(paperId);
      
      // Remove from saved papers set
      const newSavedPapers = new Set(this.state.savedPapers);
      newSavedPapers.delete(paperId);
      
      this.updateState({ savedPapers: newSavedPapers });
      
      // Refresh folders to update counts
      await this.loadFolders();
    } catch (error) {
      this.updateState({
        error: error instanceof Error ? error.message : 'Failed to unsave paper'
      });
    }
  };

  private updateState = (partial: Partial<SearchState>) => {
    this.state = { ...this.state, ...partial };
    this.setState(this.state);
  };

  // Real GraphQL API call
  private searchPapersAPI = async (query: string, filters: SearchFilters): Promise<SearchResult> => {
    const variables = {
      query,
      limit: filters.limit || 10,
      offset: filters.offset || 0,
    };

    const response = await graphqlClient.request<{ searchPapers: SearchResult }>({
      query: SEARCH_PAPERS,
      variables,
    });

    return response.searchPapers;
  };

  private savePaperAPI = async (paperId: string, notes: string, tags: string[]): Promise<SavedPaper> => {
    const variables = {
      input: { paperId, notes, tags },
    };

    const response = await graphqlClient.request<{ savePaper: SavedPaper }>({
      query: SAVE_PAPER,
      variables,
    });

    return response.savePaper;
  };

  private unsavePaperAPI = async (paperId: string): Promise<boolean> => {
    const variables = { paperId };

    const response = await graphqlClient.request<{ unsavePaper: boolean }>({
      query: UNSAVE_PAPER,
      variables,
    });

    return response.unsavePaper;
  };

  private getSavedPapersAPI = async (limit: number, offset: number): Promise<SavedPaper[]> => {
    const variables = {
      limit,
      offset,
    };

    const response = await graphqlClient.request<{ getSavedPapers: SavedPaper[] }>({
      query: GET_SAVED_PAPERS,
      variables,
    });

    return response.getSavedPapers;
  };

  private getFoldersAPI = async (): Promise<Folder[]> => {
    const response = await graphqlClient.request<{ getFolders: Folder[] }>({
      query: GET_FOLDERS,
    });

    return response.getFolders;
  };

  private createFolderAPI = async (name: string): Promise<Folder> => {
    const variables = {
      input: { name },
    };

    const response = await graphqlClient.request<{ createFolder: Folder }>({
      query: CREATE_FOLDER,
      variables,
    });

    return response.createFolder;
  };

  private movePaperToFolderAPI = async (
    savedPaperId: string,
    folderId: string | null
  ): Promise<SavedPaper> => {
    const variables = {
      paperId: savedPaperId,
      folderId,
    };

    const response = await graphqlClient.request<{ movePaperToFolder: SavedPaper }>({
      query: MOVE_PAPER_TO_FOLDER,
      variables,
    });

    return response.movePaperToFolder;
  };
}

// Hook for React - now exported from viewmodel-provider
// This is kept here for backward compatibility but re-exports from the provider
export { useSearchViewModel } from './viewmodel-provider';
