import { useState, useEffect } from 'react';
import type { SearchResult, Paper } from '@/types/search';
import { cn } from '@/lib/utils';

interface SearchResultsProps {
  results: SearchResult;
  onPaperClick?: (paper: Paper) => void;
}

export function SearchResults({ results, onPaperClick }: SearchResultsProps) {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  // Progressive fade-in animation
  useEffect(() => {
    setVisibleCards([]); // Reset on new results
    setExpandedCards(new Set()); // Reset expanded cards on new search
    
    results.papers.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards(prev => [...prev, index]);
      }, index * 150); // 150ms delay between each card
    });
  }, [results]);

  const handlePaperClick = (paper: Paper) => {
    if (onPaperClick) {
      onPaperClick(paper);
    } else if (paper.tldr) {
      // Toggle expansion for papers with TLDR
      setExpandedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(paper.id)) {
          newSet.delete(paper.id);
        } else {
          newSet.add(paper.id);
        }
        return newSet;
      });
    } else if (paper.url) {
      // Fall back to opening URL if no TLDR
      window.open(paper.url, '_blank', 'noopener,noreferrer');
    }
  };

  const isExpanded = (paperId: string) => expandedCards.has(paperId);

  return (
    <div className="space-y-8">
      {/* Search Results Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Search Results
          </h2>
          <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">
              {results.total} papers found
            </span>
          </div>
        </div>
      </div>

      {/* Search Result Cards */}
      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
        {results.papers.map((paper, index) => (
          <div
            key={paper.id}
            className={cn(
              'transform transition-all duration-700 ease-out',
              visibleCards.includes(index)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            )}
            style={{
              transitionDelay: visibleCards.includes(index) ? '0ms' : `${index * 150}ms`
            }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 group hover:shadow-xl hover:bg-white/90">
              <button
                onClick={() => handlePaperClick(paper)}
                className="w-full text-left p-6 hover:scale-[1.01] transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors leading-tight">
                    {paper.title}
                  </h3>

                  {/* Authors */}
                  <p className="text-gray-600 font-medium text-base">
                    {paper.authors.join(', ')}
                  </p>

                  {/* Metadata Tags */}
                  <div className="flex items-center flex-wrap gap-2 pt-2">
                    {paper.year && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {paper.year}
                      </span>
                    )}
                    {paper.venue && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {paper.venue}
                      </span>
                    )}
                    {paper.citationCount !== undefined && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {paper.citationCount} citations
                      </span>
                    )}
                    
                    {/* Click indicator */}
                    <div className="ml-auto flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm text-gray-500">
                        {paper.tldr ? (isExpanded(paper.id) ? 'Click to collapse' : 'Click for summary') : 'Click to view'}
                      </span>
                      <svg 
                        className={cn(
                          "w-4 h-4 text-gray-400 transition-transform duration-300",
                          paper.tldr && isExpanded(paper.id) ? "rotate-90" : "group-hover:translate-x-1"
                        )} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expandable TLDR Section */}
              {paper.tldr && (
                <div className={cn(
                  "overflow-hidden transition-all duration-500 ease-in-out",
                  isExpanded(paper.id) ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <div className="space-y-6">
                      {/* TLDR Section - First */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-blue-900 text-lg">TL;DR Summary</h4>
                        </div>
                        <p className="text-gray-800 leading-relaxed text-base pl-11">
                          {paper.tldr.text}
                        </p>
                      </div>
                      
                      {/* Abstract Section - Second */}
                      {paper.abstract && (
                        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-500 rounded-full">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h4 className="font-semibold text-gray-900 text-lg">Abstract</h4>
                          </div>
                          <p className="text-gray-700 leading-relaxed text-base pl-11">
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
                            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>Read full paper</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
        <div className="text-center pt-8">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
            <span className="text-sm">More results available</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
