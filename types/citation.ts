import type { SavedPaper } from './search'

export type CitationFormat =
  | 'apa'
  | 'mla'
  | 'chicago'
  | 'ieee'
  | 'harvard'
  | 'bibtex'

export interface CitationFormatOption {
  id: CitationFormat
  name: string
  description: string
  example: string
}

export interface CitationState {
  selectedFormat: CitationFormat
  generatedCitations: string
  isGenerating: boolean
  isOpen: boolean
  selectedPapers: SavedPaper[]
}

export interface CitationFormats {
  [key: string]: CitationFormatOption
}
