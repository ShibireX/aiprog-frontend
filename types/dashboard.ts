import type { SavedPaper, Folder } from './search';

export interface DashboardFilters {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  selectedFolderId?: string | null;
}

export interface DashboardState {
  folders: Folder[];
  savedPapers: SavedPaper[];
  uncategorizedCount: number;
  isLoading: boolean;
  isLoadingFolders: boolean;
  error: string | null;
  filters: DashboardFilters;
  total?: number;
  hasMore?: boolean;
  isAddMapOpen: boolean;
  newMapName: string;
}
