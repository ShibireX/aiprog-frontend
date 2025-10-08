'use client'

import { useAuthViewModel } from '@/lib/viewmodels/auth-viewmodel'
import { useDashboardViewModel } from '@/lib/viewmodels/dashboard-viewmodel'
import { useCitationViewModel } from '@/lib/viewmodels/citation-viewmodel'
import {
  RefreshCw,
  BookmarkCheck,
  FileText,
  Folder,
  FolderPlus,
  X,
  Trash2,
  Camera,
  Upload,
} from 'lucide-react'
import Image from 'next/image'
import { CitationPopup } from '@/components/ui/citation-popup'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchBar } from '../ui/search-bar'
import { cn } from '@/lib/utils'
import { IconButton } from '../ui/icon-button'
export function DashboardView() {
  const authViewModel = useAuthViewModel()
  const dashboardViewModel = useDashboardViewModel()
  const citationViewModel = useCitationViewModel()

  const handleBulkCitation = () => {
    citationViewModel.openPopup(dashboardViewModel.filteredSavedPapers)
  }

  const handleAvatarClick = () => {
    // Prevent multiple uploads at once
    if (authViewModel.isUploadingThumbnail) {
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        await authViewModel.uploadThumbnail(file)
      }
    }
    input.click()
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="min-h-screen from-slate-50 via-blue-50/30 to-indigo-50/50 p-4"
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <IconButton link="/" className="relative z-10" />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="mb-8 mt-12 flex flex-col items-center">
            {/* User Avatar */}
            {authViewModel.user && (
              <div className="mb-6">
                <div
                  className="group relative h-24 w-24 cursor-pointer"
                  onClick={handleAvatarClick}
                  title="Click to upload profile picture"
                >
                  {authViewModel.user.thumbnailUrl ? (
                    <Image
                      src={authViewModel.user.thumbnailUrl}
                      alt={authViewModel.user.username}
                      width={96}
                      height={96}
                      className="rounded-full border-4 border-white object-cover shadow-lg"
                      priority
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                      <span className="text-3xl font-bold text-white">
                        {authViewModel.user.username?.charAt(0).toUpperCase() ||
                          authViewModel.user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  {/* Camera Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {authViewModel.isUploadingThumbnail ? (
                      <Upload className="h-8 w-8 animate-bounce text-white" />
                    ) : (
                      <Camera className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>

                {/* Upload Error Message */}
                {authViewModel.uploadError && (
                  <p className="mt-2 text-center text-sm text-red-600">
                    {authViewModel.uploadError}
                  </p>
                )}
              </div>
            )}

            <h1 className="mb-2 text-4xl font-bold text-gray-900">
              {authViewModel.user && (
                <p className="text-gray-700">Your Dashboard</p>
              )}
            </h1>

            <p className="text-gray-600">
              Manage your saved papers and research
            </p>
          </div>
          {/* Maps/Folders Section */}
          <div className="mb-6 mt-14">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => dashboardViewModel.setSelectedFolder(null)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full',
                  'border text-sm font-medium backdrop-blur-sm',
                  'shadow-md transition-all duration-200',
                  'hover:scale-105 hover:shadow-lg',
                  'px-4 py-2',
                  dashboardViewModel.selectedFolderId === null
                    ? 'border-blue-600 bg-blue-500 text-white'
                    : 'border-white/20 bg-white/80 text-gray-700 hover:bg-white'
                )}
              >
                <Folder className="h-4 w-4" />
                <span>All</span>
                <span className="text-xs opacity-80">
                  ({dashboardViewModel.uncategorizedCount})
                </span>
              </button>

              {dashboardViewModel.folders.map(folder => (
                <button
                  key={folder.id}
                  onClick={() =>
                    dashboardViewModel.setSelectedFolder(folder.id)
                  }
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full',
                    'border text-sm font-medium backdrop-blur-sm',
                    'shadow-md transition-all duration-200',
                    'hover:scale-105 hover:shadow-lg',
                    'px-4 py-2',
                    dashboardViewModel.selectedFolderId === folder.id
                      ? 'border-blue-600 bg-blue-500 text-white'
                      : 'border-white/20 bg-white/80 text-gray-700 hover:bg-white'
                  )}
                >
                  <Folder className="h-4 w-4" />
                  <span>{folder.name}</span>
                  <span className="text-xs opacity-80">
                    ({folder.paperCount})
                  </span>
                </button>
              ))}

              {/* Add Map Button */}
              <button
                onClick={() => dashboardViewModel.openAddMapModal()}
                className="p-2 text-blue-600 transition-all duration-200 hover:scale-110 hover:text-blue-700"
                title="Create new map"
              >
                <FolderPlus className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Saved Papers Section */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  {dashboardViewModel.selectedFolder?.name || 'All'} Papers
                </h2>
              </div>
              <div className="flex items-center space-x-2 rounded-full bg-white/70 px-4 py-2 shadow-lg backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="font-medium text-gray-700">
                  {(() => {
                    const count =
                      dashboardViewModel.selectedFolderId === null
                        ? dashboardViewModel.uncategorizedCount
                        : dashboardViewModel.selectedFolder?.paperCount || 0
                    return `${count} ${count === 1 ? 'paper' : 'papers'}`
                  })()}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div>
              <SearchBar
                value={dashboardViewModel.filters.searchQuery || ''}
                onChange={dashboardViewModel.setSearchQuery}
                onSearch={() => {}}
                autoFocus={false}
                placeholder="Search papers by title, author, or venue..."
                isLoading={dashboardViewModel.isLoading}
                className="max-w-none"
                hideSearchButton
              />
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
                    Start saving papers from the search results to see them
                    here.
                  </p>
                </div>
              )}

            {/* Papers Grid */}
            {dashboardViewModel.filteredSavedPapers.length > 0 && (
              <div className="grid grid-cols-1 gap-6 pb-8">
                {dashboardViewModel.filteredSavedPapers.map(savedPaper => (
                  <div
                    key={savedPaper.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
                  >
                    {/* Action Buttons - Top Right */}
                    <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          citationViewModel.openPopup([savedPaper])
                        }}
                        className="rounded-full border border-blue-200 bg-blue-50 p-2 text-blue-600 shadow-md transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                        title="Get citation"
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          if (
                            confirm(
                              'Are you sure you want to remove this paper from your collection?'
                            )
                          ) {
                            dashboardViewModel.unsavePaper(savedPaper.id)
                          }
                        }}
                        className="rounded-full border border-red-200 bg-red-50 p-2 text-red-600 shadow-md transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700"
                        title="Remove from collection"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="w-full p-6 pr-24 text-left">
                      <div className="space-y-4">
                        {/* Title */}
                        <h3 className="text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-blue-900">
                          {savedPaper.paper.title}
                        </h3>

                        {/* Authors */}
                        <p className="text-base font-medium text-gray-600">
                          {savedPaper.paper.authors.join(', ')}
                        </p>

                        {/* Abstract */}
                        {savedPaper.paper.abstract && (
                          <p className="line-clamp-3 text-sm leading-relaxed text-gray-700">
                            {savedPaper.paper.abstract}
                          </p>
                        )}

                        {/* Metadata Tags */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {savedPaper.paper.year && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
                              {savedPaper.paper.year}
                            </span>
                          )}
                          {savedPaper.paper.venue && (
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                              {savedPaper.paper.venue}
                            </span>
                          )}
                          {savedPaper.paper.citationCount !== undefined && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                              {savedPaper.paper.citationCount} citations
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bulk Citation Button */}
            {dashboardViewModel.filteredSavedPapers.length > 1 && (
              <div className="pb-8 pt-4 text-center">
                <button
                  onClick={handleBulkCitation}
                  className="mx-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                >
                  <FileText className="h-5 w-5" />
                  Bulk Citation ({
                    dashboardViewModel.filteredSavedPapers.length
                  }{' '}
                  papers)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Citation Popup */}
        <CitationPopup citationViewModel={citationViewModel} />

        {/* Add Map Popup */}
        {dashboardViewModel.isAddMapOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => dashboardViewModel.closeAddMapModal()}
          >
            <div
              className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <FolderPlus className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Create New Map
                  </h2>
                </div>
                <button
                  onClick={() => dashboardViewModel.closeAddMapModal()}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <label
                  htmlFor="map-name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Map Name
                </label>
                <input
                  id="map-name"
                  type="text"
                  value={dashboardViewModel.newMapName}
                  onChange={e =>
                    dashboardViewModel.setNewMapName(e.target.value)
                  }
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      dashboardViewModel.createMap()
                    } else if (e.key === 'Escape') {
                      dashboardViewModel.closeAddMapModal()
                    }
                  }}
                  placeholder="e.g., Computer Vision, Machine Learning"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <p className="mt-2 text-sm text-gray-500">
                  Choose a descriptive name for your research map
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6">
                <button
                  onClick={() => dashboardViewModel.closeAddMapModal()}
                  className="rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => dashboardViewModel.createMap()}
                  disabled={!dashboardViewModel.newMapName.trim()}
                  className={cn(
                    'rounded-lg px-6 py-2 transition-all duration-200',
                    dashboardViewModel.newMapName.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'
                      : 'cursor-not-allowed bg-gray-300 text-gray-500'
                  )}
                >
                  Create Map
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
