'use client';

import { useState, useRef } from 'react';
import type { SearchState, SearchFilters, SearchResult } from '@/types/search';
import { graphqlClient } from '@/lib/graphql/client';
import { SEARCH_PAPERS } from '@/lib/graphql/queries';

export class LibraryViewModel {
  private state: SearchState;
  private setState: (state: SearchState) => void;

  constructor(initialState: SearchState, setState: (state: SearchState) => void) {
    this.state = initialState;
    this.setState = setState;
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

  // Actions

  /*get user papers */
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
}

export function useLibraryViewModel() {
  const [state, setState] = useState<SearchState>({
    query: '',
    filters: {},
    results: null,
    isLoading: false,
    error: null,
  });

  const viewModel = useRef(new LibraryViewModel(state, setState));

  return viewModel.current;
}
