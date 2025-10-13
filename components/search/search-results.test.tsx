import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { SearchResults } from './search-results'

type VM = {
  savedPapers: Set<string>
  savingPapers: Set<string>
  savePaper: (id: string) => void
  unsavePaper: (id: string) => void
}

function makeVM(partial: Partial<VM> = {}): VM {
  return {
    savedPapers: new Set(),
    savingPapers: new Set(),
    savePaper: vi.fn(),
    unsavePaper: vi.fn(),
    ...partial,
  }
}

function makeResults({
  count = 2,
  withTLDRFirst = true,
  next = false,
}: { count?: number; withTLDRFirst?: boolean; next?: boolean } = {}) {
  const papers = Array.from({ length: count }, (_, i) => {
    const id = `p${i}`
    const base = {
      id,
      title: `Paper ${i}`,
      authors: ['Alice', 'Bob'],
      year: 2024,
      venue: 'Conf',
      citationCount: 10 + i,
      abstract: 'Some abstract',
      url: `https://example.com/${id}`,
    }
    if (i === 0 && withTLDRFirst) {
      return { ...base, tldr: { text: 'Short summary' } }
    }
    return base // no tldr
  })
  return { total: papers.length, papers, next }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('<SearchResults />', () => {
  it('shows correct number of papers', () => {
    const results = makeResults({ count: 2 })
    const vm = makeVM()
    render(
      <SearchResults results={results as any} searchViewModel={vm as any} />
    )

    expect(
      screen.getByRole('heading', { name: /search results/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/2 papers found/i)).toBeInTheDocument()
  })
})
