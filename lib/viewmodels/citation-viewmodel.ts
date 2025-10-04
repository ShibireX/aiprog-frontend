'use client';

import { useState, useRef } from 'react';
import type { CitationState, CitationFormat, CitationFormats } from '@/types/citation';
import type { SavedPaper } from '@/types/search';

const CITATION_FORMATS: CitationFormats = {
  apa: {
    id: 'apa',
    name: 'APA Style',
    description: 'American Psychological Association (7th Edition)',
    example: 'Author, A. A. (Year). Title of article. Journal Name, Volume(Issue), pages.'
  },
  mla: {
    id: 'mla',
    name: 'MLA Style',
    description: 'Modern Language Association (9th Edition)',
    example: 'Author. "Title of Article." Journal Name, vol. #, no. #, Year, pp. #-#.'
  },
  chicago: {
    id: 'chicago',
    name: 'Chicago Style',
    description: 'Chicago Manual of Style (17th Edition)',
    example: 'Author. "Title of Article." Journal Name Volume, no. Issue (Year): pages.'
  },
  ieee: {
    id: 'ieee',
    name: 'IEEE Style',
    description: 'Institute of Electrical and Electronics Engineers',
    example: 'A. Author, "Title of article," Journal Name, vol. #, no. #, pp. #-#, Year.'
  },
  harvard: {
    id: 'harvard',
    name: 'Harvard Style',
    description: 'Harvard Reference System',
    example: 'Author, A. (Year) \'Title of article\', Journal Name, vol. #, no. #, pp. #-#.'
  },
  bibtex: {
    id: 'bibtex',
    name: 'BibTeX',
    description: 'LaTeX Bibliography Format',
    example: '@article{key, author={Author}, title={Title}, journal={Journal}, year={Year}}'
  }
};

export class CitationViewModel {
  private state: CitationState;
  private setState: (state: CitationState) => void;

  constructor(initialState: CitationState, setState: (state: CitationState) => void) {
    this.state = initialState;
    this.setState = setState;
  }

  // Getters
  get selectedFormat() { return this.state.selectedFormat; }
  get generatedCitations() { return this.state.generatedCitations; }
  get isGenerating() { return this.state.isGenerating; }
  get isOpen() { return this.state.isOpen; }
  get selectedPapers() { return this.state.selectedPapers; }
  get availableFormats() { return Object.values(CITATION_FORMATS); }

  // Actions
  openPopup = (papers: SavedPaper[]) => {
    this.updateState({
      isOpen: true,
      selectedPapers: papers,
      generatedCitations: ''
    });
  };

  closePopup = () => {
    this.updateState({
      isOpen: false,
      selectedPapers: [],
      generatedCitations: ''
    });
  };

  setFormat = (format: CitationFormat) => {
    this.updateState({ selectedFormat: format });
  };

  generateCitations = async () => {
    this.updateState({ isGenerating: true });

    try {
      // Simulate citation generation (you could replace this with actual formatting logic)
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const citations = this.formatCitations(this.state.selectedPapers, this.state.selectedFormat);
      this.updateState({ 
        generatedCitations: citations,
        isGenerating: false 
      });
    } catch (error) {
      this.updateState({ isGenerating: false });
    }
  };

  copyToClipboard = async () => {
    if (this.state.generatedCitations && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(this.state.generatedCitations);
        return true;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
      }
    }
    return false;
  };

  private formatCitations = (papers: SavedPaper[], format: CitationFormat): string => {
    return papers.map((savedPaper, _index) => {
      const paper = savedPaper.paper;
      const authors = paper.authors.slice(0, 3).join(', ');
      const moreAuthors = paper.authors.length > 3 ? ' et al.' : '';
      const year = paper.year || 'n.d.';
      const venue = paper.venue || 'Unknown Journal';

      switch (format) {
        case 'apa':
          return `${authors}${moreAuthors} (${year}). ${paper.title}. ${venue}.`;
        
        case 'mla':
          return `${authors}${moreAuthors} "${paper.title}." ${venue}, ${year}.`;
        
        case 'chicago':
          return `${authors}${moreAuthors} "${paper.title}." ${venue} (${year}).`;
        
        case 'ieee':
          return `${authors}${moreAuthors} "${paper.title}," ${venue}, ${year}.`;
        
        case 'harvard':
          return `${authors}${moreAuthors} (${year}) '${paper.title}', ${venue}.`;
        
        case 'bibtex':
          // Generate a unique key from first author surname and year
          const firstAuthor = paper.authors[0] || 'Unknown';
          const authorSurname = firstAuthor.split(' ').pop()?.toLowerCase() || 'unknown';
          const key = `${authorSurname}${year}${paper.title.split(' ')[0]?.toLowerCase() || ''}`;
          
          return `@article{${key},
  author = {${authors}${moreAuthors}},
  title = {${paper.title}},
  journal = {${venue}},
  year = {${year}}${paper.url ? `,\n  url = {${paper.url}}` : ''}
}`;
        
        default:
          return `${authors}${moreAuthors} (${year}). ${paper.title}. ${venue}.`;
      }
    }).join('\n\n');
  };

  private updateState = (partial: Partial<CitationState>) => {
    this.state = { ...this.state, ...partial };
    this.setState(this.state);
  };
}

export function useCitationViewModel() {
  const [state, setState] = useState<CitationState>({
    selectedFormat: 'apa',
    generatedCitations: '',
    isGenerating: false,
    isOpen: false,
    selectedPapers: [],
  });

  const viewModel = useRef(new CitationViewModel(state, setState));
  viewModel.current = new CitationViewModel(state, setState);

  return viewModel.current;
}
