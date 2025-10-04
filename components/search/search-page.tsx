'use client'

import { SearchBar } from '@/components/ui/search-bar'
import { InfoCard } from '@/components/ui/info-card'
import { SearchResults } from '@/components/search/search-results'
import { FolderSelectionPopup } from '@/components/ui/folder-selection-popup'
import { useSearchViewModel } from '@/lib/viewmodels/search-viewmodel'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/user-avatar'

export function SearchPage() {
  const searchViewModel = useSearchViewModel()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header Section */}
      <div className="relative">
      <div className="flex justify-end place-items-end px-4 flex-row p-4">
        {searchViewModel.auth.isAuthenticated ? (
          <UserAvatar />
        ) : (
          <Button description="Sign up" link="/signup" />
        )}
      </div>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-6">
              <h1 className="mb-2 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl">
                Papr
              </h1>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            </div>
            <p className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-gray-700">
              Discover and reference scientific publications with ease
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
            <div className="mx-auto mt-6 max-w-2xl">
              <div className="rounded-2xl border border-red-200/50 bg-red-50/80 p-4 backdrop-blur-sm">
                <p className="text-center text-red-700">
                  {searchViewModel.error}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {!searchViewModel.results ? (
          <div className="space-y-16">
            {/* About Papr Section */}
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Revolutionizing Scientific Discovery
              </h2>
              <p className="mx-auto max-w-4xl text-xl font-light leading-relaxed text-gray-600">
                Papr harnesses the power of artificial intelligence to transform
                how students and researchers discover, analyze, and connect
                scientific publications across disciplines
              </p>
            </div>

            {/* Feature Cards - Only 3 cards */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
              <InfoCard
                icon={
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                title="Intelligent Search"
                description="Our AI understands context and semantics, delivering precisely what you need from millions of publications."
              />

              <InfoCard
                icon={
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
                title="Deep Analytics"
                description="Uncover research trends, citation patterns, and emerging topics with comprehensive insights and visualizations."
              />

              <InfoCard
                icon={
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                }
                title="Knowledge Networks"
                description="Discover hidden connections between papers, authors, and research domains across the scientific landscape."
              />
            </div>
          </div>
        ) : searchViewModel.results ? (
          <SearchResults results={searchViewModel.results} searchViewModel={searchViewModel} />
        ) : null}
      </div>

      {/* Folder Selection Popup */}
      <FolderSelectionPopup searchViewModel={searchViewModel} />
    </div>
  )
}
