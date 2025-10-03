import type { SavedPaper } from './search';

export interface DashboardFilters {
  limit?: number;
  offset?: number;
  tags?: string[];
  searchQuery?: string;
}

export interface DashboardState {
  savedPapers: SavedPaper[];
  isLoading: boolean;
  error: string | null;
  filters: DashboardFilters;
  total?: number;
  hasMore?: boolean;
}
