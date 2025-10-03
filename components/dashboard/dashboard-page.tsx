'use client'

import { useAuthViewModel } from '@/lib/viewmodels/auth-viewmodel'
import { useDashboardViewModel } from '@/lib/viewmodels/dashboard-viewmodel'
import { useCitationViewModel } from '@/lib/viewmodels/citation-viewmodel'
import { useRouter } from 'next/navigation'
import { LogOut, RefreshCw, BookmarkCheck, FileText } from 'lucide-react'
import { CitationPopup } from '@/components/ui/citation-popup'
import { UserAvatar } from '@/components/ui/user-avatar'
import { PaperFolderIcon } from '@/components/ui/paper-folder'
import { AddFolderIcon } from '@/components/ui/add-folder'
import { SearchBar } from '../ui/search-bar'
import {
  SearchViewModel,
  useSearchViewModel,
} from '@/lib/viewmodels/search-viewmodel'
import { cn } from '@/lib/utils'
export function DashboardView() {
  const authViewModel = useAuthViewModel()
  const dashboardViewModel = useDashboardViewModel()
  const citationViewModel = useCitationViewModel()
  const SearchViewModel = useSearchViewModel()
  const router = useRouter()

  const handleLogout = () => {
    authViewModel.logout()
    router.push('/')
  }

  const handleBulkCitation = () => {
    citationViewModel.openPopup(dashboardViewModel.savedPapers)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <UserAvatar />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8 mt-12 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            {authViewModel.user && (
              <p className="text-gray-700">
                Welcome,
                <span className="font-semibold">
                  {authViewModel.user.email}
                </span>
              </p>
            )}
          </h1>

          <p className="text-gray-600">Manage your saved papers and research</p>
        </div>
        <div className="relative flex items-center justify-center  py-4">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
            <AddFolderIcon />
            <button
              onClick={() => dashboardViewModel.refreshPapers()}
              disabled={dashboardViewModel.isLoading}
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full',
                'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
                'shadow-lg transition-all duration-300',
                'hover:scale-105 hover:shadow-xl',
                'hover:-translate-y-1 hover:transform',
                'm-4'
              )}
            >
              <RefreshCw
                className={`h-4 w-4 ${dashboardViewModel.isLoading ? 'animate-spin' : ''}`}
              />
            </button>
          </div>

          <SearchBar
            value={SearchViewModel.query}
            onChange={SearchViewModel.setQuery}
            onSearch={SearchViewModel.performSearch}
            autoFocus
            isLoading={SearchViewModel.isLoading}
          />
        </div>
        {/* User Info & Actions */}
        <div className="items-left justify-left mb-8 flex rounded-2xl bg-white/40 p-6 shadow-lg backdrop-blur-sm">
          <PaperFolderIcon text="FolderName"/>

          <div className="flex gap-3">
            {/*  <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout 
            </button>*/}
          </div>
        </div>

        {/* Saved Papers Section */}
        <div className="rounded-2xl bg-white/40 p-6 shadow-lg backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-2">
            <BookmarkCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Saved Papers
            </h2>
            <span className="text-gray-500">
              ({dashboardViewModel.savedPapers.length})
            </span>
          </div>

          {/* Loading State */}
          {dashboardViewModel.isLoading &&
            dashboardViewModel.savedPapers.length === 0 && (
              <div className="py-8 text-center">
                <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
                <p className="text-gray-600">Loading your saved papers...</p>
              </div>
            )}

          {/* Error State */}
          {dashboardViewModel.error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-red-700">{dashboardViewModel.error}</p>
              <button
                onClick={() => dashboardViewModel.clearError()}
                className="mt-2 text-sm text-red-600 underline hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Empty State */}
          {!dashboardViewModel.isLoading &&
            dashboardViewModel.savedPapers.length === 0 &&
            !dashboardViewModel.error && (
              <div className="py-12 text-center">
                <BookmarkCheck className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <h3 className="mb-2 text-xl font-semibold text-gray-600">
                  No saved papers yet
                </h3>
                <p className="text-gray-500">
                  Start saving papers from the search results to see them here.
                </p>
              </div>
            )}

          {/* Papers List */}
          {dashboardViewModel.savedPapers.length > 0 && (
            <div className="space-y-4">
              {dashboardViewModel.savedPapers.map(savedPaper => (
                <div
                  key={savedPaper.id}
                  className="rounded-lg border border-white/20 bg-white/60 p-4 shadow-sm"
                >
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {savedPaper.paper.title}
                  </h3>
                  <p className="mb-2 text-sm text-gray-600">
                    {savedPaper.paper.authors.join(', ')}
                  </p>
                  {savedPaper.paper.abstract && (
                    <p className="mb-3 line-clamp-3 text-sm text-gray-700">
                      {savedPaper.paper.abstract}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {savedPaper.paper.year && (
                        <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                          {savedPaper.paper.year}
                        </span>
                      )}
                      {savedPaper.paper.venue && (
                        <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                          {savedPaper.paper.venue}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Saved{' '}
                      {new Date(savedPaper.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {dashboardViewModel.hasMore && (
                <div className="pt-4 text-center">
                  <button
                    onClick={() => dashboardViewModel.loadMorePapers()}
                    disabled={dashboardViewModel.isLoading}
                    className="rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                  >
                    {dashboardViewModel.isLoading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bulk Citation Button */}
          {dashboardViewModel.savedPapers.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={handleBulkCitation}
                className="mx-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
              >
                <FileText className="h-5 w-5" />
                Bulk Citation ({dashboardViewModel.savedPapers.length} papers)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Citation Popup */}
      <CitationPopup citationViewModel={citationViewModel} />
    </div>
  )
}
