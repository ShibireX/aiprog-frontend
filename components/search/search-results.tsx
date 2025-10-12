import { useState, useEffect } from 'react'
import type { SearchResult, Paper } from '@/types/search'
import type { SearchViewModel } from '@/lib/viewmodels/search-viewmodel'
import { cn } from '@/lib/utils'
import { Bookmark, BookmarkCheck, Loader } from 'lucide-react'

interface SearchResultsProps {
  results: SearchResult
  searchViewModel: SearchViewModel
  onPaperClick?: (paper: Paper) => void
}

export function SearchResults({
  results,
  searchViewModel,
  onPaperClick,
}: SearchResultsProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())

  // Progressive fade-in animation
  useEffect(() => {
    setVisibleCards([]) // Reset on new results
    setExpandedCards(new Set()) // Reset expanded cards on new search

    results.papers.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index])
      }, index * 150) // 150ms delay between each card
    })
  }, [results])

  const handlePaperClick = (paper: Paper) => {
    if (onPaperClick) {
      onPaperClick(paper)
    } else if (paper.tldr) {
      // Toggle expansion for papers with TLDR
      setExpandedCards(prev => {
        const newSet = new Set(prev)
        if (newSet.has(paper.id)) {
          newSet.delete(paper.id)
        } else {
          newSet.add(paper.id)
        }
        return newSet
      })
    } else if (paper.url) {
      // Fall back to opening URL if no TLDR
      window.open(paper.url, '_blank', 'noopener,noreferrer')
    }
  }

  const isExpanded = (paperId: string) => expandedCards.has(paperId)

  return (
    <div className="space-y-8">
      {/* Search Results Header */}
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Search Results
          </h2>
          <div className="flex items-center space-x-2 rounded-full bg-white/70 px-4 py-2 shadow-lg backdrop-blur-sm dark:bg-slate-800/70">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
            <span className="font-medium text-gray-700 dark:text-gray-200">
              {results.total} papers found
            </span>
          </div>
        </div>
      </div>

      {/* Search Result Cards */}
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6">
        {results.papers.map((paper, index) => (
          <div
            key={paper.id}
            className={cn(
              'transform transition-all duration-700 ease-out',
              visibleCards.includes(index)
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            )}
            style={{
              transitionDelay: visibleCards.includes(index)
                ? '0ms'
                : `${index * 150}ms`,
            }}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-xl dark:border-gray-700/50 dark:bg-slate-800/80 dark:hover:bg-slate-700/70">
              {/* Save Button - Top Right */}
              <button
                onClick={e => {
                  e.stopPropagation()
                  if (searchViewModel.savedPapers.has(paper.id)) {
                    if (confirm('Remove this paper from your collection?')) {
                      searchViewModel.unsavePaper(paper.id)
                    }
                  } else {
                    searchViewModel.savePaper(paper.id)
                  }
                }}
                disabled={searchViewModel.savingPapers.has(paper.id)}
                className={cn(
                  'absolute right-4 top-4 z-10 rounded-full p-2 shadow-md transition-all duration-200',
                  searchViewModel.savedPapers.has(paper.id)
                    ? 'border border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400'
                )}
                title={
                  searchViewModel.savedPapers.has(paper.id)
                    ? 'Saved'
                    : 'Save paper'
                }
              >
                {searchViewModel.savingPapers.has(paper.id) ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : searchViewModel.savedPapers.has(paper.id) ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={() => handlePaperClick(paper)}
                className="w-full p-6 pr-16 text-left transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-blue-900 dark:text-gray-100 dark:group-hover:text-blue-200">
                    {paper.title}
                  </h3>

                  {/* Authors */}
                  <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                    {paper.authors.join(', ')}
                  </p>

                  {/* Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {paper.year && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-slate-900 dark:text-gray-200">
                        {paper.year}
                      </span>
                    )}
                    {paper.venue && (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-slate-900 dark:text-blue-300">
                        {paper.venue}
                      </span>
                    )}
                    {paper.citationCount !== undefined && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-slate-900 dark:text-green-300">
                        {paper.citationCount} citations
                      </span>
                    )}

                    {/* Click indicator */}
                    <div className="ml-auto flex items-center space-x-2 opacity-60 transition-opacity group-hover:opacity-100">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {paper.tldr
                          ? isExpanded(paper.id)
                            ? 'Click to collapse'
                            : 'Click for summary'
                          : 'Click to view'}
                      </span>
                      <svg
                        className={cn(
                          'h-4 w-4 text-gray-400 transition-transform duration-300 dark:text-gray-500',
                          paper.tldr && isExpanded(paper.id)
                            ? 'rotate-90'
                            : 'group-hover:translate-x-1'
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expandable TLDR Section */}
              {paper.tldr && (
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-500 ease-in-out',
                    isExpanded(paper.id)
                      ? 'max-h-[1000px] opacity-100'
                      : 'max-h-0 opacity-0'
                  )}
                >
                  <div className="border-t border-gray-100 px-6 pb-6 pt-2 dark:border-gray-700">
                    <div className="space-y-6">
                      {/* TLDR Section - First */}
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/50 dark:bg-blue-950/30">
                        <div className="mb-3 flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-600">
                            <svg
                              className="h-4 w-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300">
                            TL;DR Summary
                          </h4>
                        </div>
                        <p className="pl-11 text-base leading-relaxed text-gray-800 dark:text-gray-300">
                          {paper.tldr.text}
                        </p>
                      </div>

                      {/* Abstract Section - Second */}
                      {paper.abstract && (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700/50 dark:bg-gray-900/30">
                          <div className="mb-3 flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 dark:bg-gray-700">
                              <svg
                                className="h-4 w-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              Abstract
                            </h4>
                          </div>
                          <p className="pl-11 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            {paper.abstract}
                          </p>
                        </div>
                      )}
                      {paper.url && (
                        <div className="pt-2">
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 font-medium text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            onClick={e => e.stopPropagation()}
                          >
                            <span>Read full paper</span>
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Indicator */}
      {results.next && (
        <div className="pt-8 text-center">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <span className="text-sm">
              For more relevant results, try adjusting your search query
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
