export interface Tldr {
  model: string
  text: string
}

export interface Paper {
  id: string
  semanticScholarId?: string
  title: string
  authors: string[]
  abstract?: string
  year?: number
  venue?: string
  url?: string
  citationCount?: number
  tldr?: Tldr
  createdAt?: string
  updatedAt?: string
}

export interface SearchResult {
  papers: Paper[]
  total: number
  offset: number
  next?: number
}

export interface Folder {
  id: string
  userId: string
  name: string
  paperCount: number
  papers?: SavedPaper[]
  createdAt: string
  updatedAt: string
}

export interface SavedPaper {
  id: string
  userId: string
  paperId: string
  folderId?: string
  paper: Paper
  notes: string
  tags: string[]
  createdAt: string
}
export interface SearchFilters {
  limit?: number
  offset?: number
}

export interface SearchState {
  query: string
  filters: SearchFilters
  results: SearchResult | null
  isLoading: boolean
  error: string | null
  savedPapers: Set<string> // Track saved paper IDs
  savingPapers: Set<string> // Track papers currently being saved
  folders: Folder[] // Available folders for saving papers
  isSelectingFolder: boolean // Whether folder selection modal is open
  selectedPaperToSave: string | null // Paper ID being saved
  newFolderName: string // Name for creating new folder during save
}
