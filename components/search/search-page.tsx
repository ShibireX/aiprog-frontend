'use client';

import { SearchBar } from '@/components/ui/search-bar';
import { InfoCard } from '@/components/ui/info-card';
import { SearchResults } from '@/components/search/search-results';
import { useSearchViewModel } from '@/lib/viewmodels/search-viewmodel';

export function SearchPage() {
  const searchViewModel = useSearchViewModel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Header Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 sm:text-7xl mb-2 tracking-tight">
                Papr
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
              Discover and explore scientific publications with ease
            </p>
          </div>
          
          <div className="mb-8">
            <SearchBar
              value={searchViewModel.query}
              onChange={searchViewModel.setQuery}
              onSearch={searchViewModel.performSearch}
              autoFocus
              isLoading={searchViewModel.isLoading}
            />
          </div>
          
          {searchViewModel.error && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
                <p className="text-red-700 text-center">{searchViewModel.error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        {!searchViewModel.results ? (
          <div className="space-y-16">
            {/* About Papr Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Revolutionizing Scientific Discovery
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
                Papr harnesses the power of artificial intelligence to transform how students and researchers discover, 
                analyze, and connect scientific publications across disciplines
              </p>
            </div>

            {/* Feature Cards - Only 3 cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <InfoCard
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
                title="Intelligent Search"
                description="Our AI understands context and semantics, delivering precisely what you need from millions of publications."
              />
              
              <InfoCard
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
                title="Deep Analytics"
                description="Uncover research trends, citation patterns, and emerging topics with comprehensive insights and visualizations."
              />
              
              <InfoCard
                icon={
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                }
                title="Knowledge Networks"
                description="Discover hidden connections between papers, authors, and research domains across the scientific landscape."
              />
            </div>
            
            </div>
          ) : searchViewModel.results ? (
            <SearchResults results={searchViewModel.results} />
          ) : null}
      </div>
    </div>
  );
}
