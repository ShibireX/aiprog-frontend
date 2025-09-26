'use client';

import { useState, useRef } from 'react';
import type { SearchState, SearchFilters, SearchResult, SavedPaper } from '@/types/search';
import { graphqlClient } from '@/lib/graphql/client';
import { SAVE_PAPER, SEARCH_PAPERS } from '@/lib/graphql/queries';
import { useAuthViewModel, AuthViewModel } from './auth-viewmodel';

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

  savePaper = async (paperId: string, notes: string = '', tags: string[] = []) => {
    // Check if user is authenticated
    if (!this.auth.isAuthenticated) {
      this.updateState({ error: 'Please log in to save papers' });
      return;
    }

    // Check if paper is already saved
    if (this.state.savedPapers.has(paperId)) {
      return; // Already saved
    }

    // Add to saving state
    const newSavingPapers = new Set(this.state.savingPapers);
    newSavingPapers.add(paperId);
    this.updateState({ savingPapers: newSavingPapers });

    try {
      await this.savePaperAPI(paperId, notes, tags);
      
      // Add to saved papers and remove from saving
      const newSavedPapers = new Set(this.state.savedPapers);
      newSavedPapers.add(paperId);
      const updatedSavingPapers = new Set(this.state.savingPapers);
      updatedSavingPapers.delete(paperId);
      
      this.updateState({ 
        savedPapers: newSavedPapers,
        savingPapers: updatedSavingPapers
      });
    } catch (error) {
      // Remove from saving state on error
      const updatedSavingPapers = new Set(this.state.savingPapers);
      updatedSavingPapers.delete(paperId);
      
      this.updateState({
        savingPapers: updatedSavingPapers,
        error: error instanceof Error ? error.message : 'Failed to save paper'
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
}

export function useSearchViewModel() {
  const authViewModel = useAuthViewModel();
  const [state, setState] = useState<SearchState>({
    query: '',
    filters: {},
    results: null,
    isLoading: false,
    error: null,
    savedPapers: new Set<string>(),
    savingPapers: new Set<string>(),
  });

  const viewModel = useRef(new SearchViewModel(state, setState, authViewModel));
  viewModel.current = new SearchViewModel(state, setState, authViewModel);

  return viewModel.current;
}
