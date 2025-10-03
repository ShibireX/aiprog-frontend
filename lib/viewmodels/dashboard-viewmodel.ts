'use client';

import { useState, useRef, useEffect } from 'react';
import type { DashboardState, DashboardFilters } from '@/types/dashboard';
import type { SavedPaper } from '@/types/search';
import { graphqlClient } from '@/lib/graphql/client';
import { GET_SAVED_PAPERS } from '@/lib/graphql/queries';
import { useAuthViewModel, AuthViewModel } from './auth-viewmodel';

export class DashboardViewModel {
  private state: DashboardState;
  private setState: (state: DashboardState) => void;
  public auth: AuthViewModel;

  constructor(initialState: DashboardState, setState: (state: DashboardState) => void, authViewModel: AuthViewModel) {
    this.state = initialState;
    this.setState = setState;
    this.auth = authViewModel;
  }

  // Getters
  get savedPapers() {
    return this.state.savedPapers;
  }

  get isLoading() {
    return this.state.isLoading;
  }

  get error() {
    return this.state.error;
  }

  get filters() {
    return this.state.filters;
  }

  get total() {
    return this.state.total;
  }

  get hasMore() {
    return this.state.hasMore;
  }

  // Derived
  get filteredSavedPapers() {
    const query = (this.state.filters.searchQuery || '').trim().toLowerCase();
    if (!query) return this.state.savedPapers;
    return this.state.savedPapers.filter(sp => {
      const paper = sp.paper;
      const searchableText = [
        paper.title,
        paper.authors.join(' '),
        paper.abstract || '',
        paper.venue || '',
        paper.year?.toString() || ''
      ].join(' ').toLowerCase();
      return searchableText.includes(query);
    });
  }

  // Actions
  loadSavedPapers = async (refresh: boolean = false) => {
    // Check if user is authenticated
    if (!this.auth.isAuthenticated) {
      this.updateState({ error: 'Please log in to view saved papers' });
      return;
    }

    // If refreshing, reset the offset and clear existing papers
    const currentOffset = refresh ? 0 : this.state.savedPapers.length;
    const currentPapers = refresh ? [] : this.state.savedPapers;

    this.updateState({ isLoading: true, error: null });

    try {
      const result = await this.getSavedPapersAPI(this.state.filters.limit || 10, currentOffset);
      
      // Combine with existing papers (for pagination) or replace (for refresh)
      const updatedPapers = refresh ? result : [...currentPapers, ...result];
      
      this.updateState({ 
        savedPapers: updatedPapers,
        isLoading: false,
        hasMore: result.length === (this.state.filters.limit || 10) // Has more if we got a full page
      });
    } catch (error) {
      this.updateState({
        error: error instanceof Error ? error.message : 'Failed to load saved papers',
        isLoading: false,
      });
    }
  };

  loadMorePapers = async () => {
    if (!this.state.hasMore || this.state.isLoading) return;
    await this.loadSavedPapers(false);
  };

  refreshPapers = async () => {
    await this.loadSavedPapers(true);
  };

  setFilters = (filters: Partial<DashboardFilters>) => {
    const newFilters = { ...this.state.filters, ...filters };
    this.updateState({ filters: newFilters });
  };

  setSearchQuery = (searchQuery: string) => {
    this.setFilters({ searchQuery });
  };

  clearError = () => {
    this.updateState({ error: null });
  };

  private updateState = (partial: Partial<DashboardState>) => {
    this.state = { ...this.state, ...partial };
    this.setState(this.state);
  };

  // GraphQL API call
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
}

export function useDashboardViewModel() {
  const authViewModel = useAuthViewModel();
  const [state, setState] = useState<DashboardState>({
    savedPapers: [],
    isLoading: false,
    error: null,
    filters: {
      limit: 10,
      offset: 0,
    },
    hasMore: false,
  });

  const viewModel = useRef(new DashboardViewModel(state, setState, authViewModel));
  viewModel.current = new DashboardViewModel(state, setState, authViewModel);

  // Auto-load papers when authenticated (MVVM compliant)
  useEffect(() => {
    if (authViewModel.isAuthenticated) {
      viewModel.current.loadSavedPapers(true);
    }
  }, [authViewModel.isAuthenticated]);

  return viewModel.current;
}