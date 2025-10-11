'use client'

import { SearchBar } from '@/components/ui/search-bar'
import { InfoCard } from '@/components/ui/info-card'
import { SearchResults } from '@/components/search/search-results'
import { FolderSelectionPopup } from '@/components/ui/folder-selection-popup'
import { useSearchViewModel } from '@/lib/viewmodels/search-viewmodel'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/user-avatar'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeSwitch } from '../ui/theme-switch'

export function SearchPage() {
  const searchViewModel = useSearchViewModel()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="search"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="min-h-screen"
      >
        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-row place-items-end justify-end p-4 px-4">
            {searchViewModel.auth.isAuthenticated ? (
              <div>
                <UserAvatar />
                <ThemeSwitch />
              </div>
            ) : (
              <Button description="Sign up" link="/signup" />
            )}
          </div>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mb-6">
                <h1 className="mb-2 bg-gray-800 from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-6xl font-medium tracking-tight text-transparent dark:text-gray-200 sm:text-7xl">
                  [ Papr ]
                </h1>
              </div>
              <p className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-gray-700 dark:text-gray-200 dark:text-gray-300">
                Your personal research library and citation assistant
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
                <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-200">
                  Streamline Your Academic Research
                </h2>
                <p className="mx-auto max-w-4xl text-xl font-light leading-relaxed text-gray-600 dark:text-gray-300">
                  Search millions of academic papers, save your favorites to
                  organized folders, and generate citations instantly.
                  Everything you need to manage your research in one place.
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
                  title="Search & Discover"
                  description="Find academic papers across all disciplines. Search by title, author, topic, or keywords to discover relevant research instantly."
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
                        d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                  title="Organize & Save"
                  description="Build your personal research library. Create custom folders to organize papers by topic, project, or any way that suits your workflow."
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
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                  title="Cite Easily"
                  description="Generate citations instantly in multiple formats. Save time on bibliography management with bulk citation export for your saved papers."
                />
              </div>
            </div>
          ) : searchViewModel.results ? (
            <SearchResults
              results={searchViewModel.results}
              searchViewModel={searchViewModel}
            />
          ) : null}
        </div>

        {/* Folder Selection Popup */}
        <FolderSelectionPopup searchViewModel={searchViewModel} />
      </motion.div>
    </AnimatePresence>
  )
}
