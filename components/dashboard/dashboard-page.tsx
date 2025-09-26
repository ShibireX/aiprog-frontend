'use client'

import { useAuthViewModel } from '@/lib/viewmodels/auth-viewmodel'
import { useDashboardViewModel } from '@/lib/viewmodels/dashboard-viewmodel'
import { useCitationViewModel } from '@/lib/viewmodels/citation-viewmodel'
import { useRouter } from 'next/navigation'
import { LogOut, RefreshCw, BookmarkCheck, FileText } from 'lucide-react'
import { CitationPopup } from '@/components/ui/citation-popup'

export function DashboardView() {
  const authViewModel = useAuthViewModel()
  const dashboardViewModel = useDashboardViewModel()
  const citationViewModel = useCitationViewModel()
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
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">Manage your saved papers and research</p>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center justify-between mb-8 bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div>
            {authViewModel.user && (
              <p className="text-gray-700">
                Welcome, <span className="font-semibold">{authViewModel.user.email}</span>
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => dashboardViewModel.refreshPapers()}
              disabled={dashboardViewModel.isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${dashboardViewModel.isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Saved Papers Section */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <BookmarkCheck className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Saved Papers</h2>
            <span className="text-gray-500">({dashboardViewModel.savedPapers.length})</span>
          </div>

          {/* Loading State */}
          {dashboardViewModel.isLoading && dashboardViewModel.savedPapers.length === 0 && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-gray-600">Loading your saved papers...</p>
            </div>
          )}

          {/* Error State */}
          {dashboardViewModel.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700">{dashboardViewModel.error}</p>
              <button
                onClick={() => dashboardViewModel.clearError()}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Empty State */}
          {!dashboardViewModel.isLoading && dashboardViewModel.savedPapers.length === 0 && !dashboardViewModel.error && (
            <div className="text-center py-12">
              <BookmarkCheck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved papers yet</h3>
              <p className="text-gray-500">Start saving papers from the search results to see them here.</p>
            </div>
          )}

          {/* Papers List */}
          {dashboardViewModel.savedPapers.length > 0 && (
            <div className="space-y-4">
              {dashboardViewModel.savedPapers.map((savedPaper) => (
                <div key={savedPaper.id} className="bg-white/60 rounded-lg p-4 shadow-sm border border-white/20">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {savedPaper.paper.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {savedPaper.paper.authors.join(', ')}
                  </p>
                  {savedPaper.paper.abstract && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                      {savedPaper.paper.abstract}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {savedPaper.paper.year && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {savedPaper.paper.year}
                        </span>
                      )}
                      {savedPaper.paper.venue && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {savedPaper.paper.venue}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Saved {new Date(savedPaper.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Load More Button */}
              {dashboardViewModel.hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => dashboardViewModel.loadMorePapers()}
                    disabled={dashboardViewModel.isLoading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
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
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
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
