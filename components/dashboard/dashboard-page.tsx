'use client'

import { useAuthViewModel } from '@/lib/viewmodels/auth-viewmodel'
import { useDashboardViewModel } from '@/lib/viewmodels/dashboard-viewmodel'
import { useCitationViewModel } from '@/lib/viewmodels/citation-viewmodel'
import { RefreshCw, BookmarkCheck, FileText, Folder, FolderPlus, X, Trash2, Camera, Upload } from 'lucide-react'
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
    input.onchange = async (e) => {
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
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4"
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
                className="relative w-24 h-24 cursor-pointer group"
                onClick={handleAvatarClick}
                title="Click to upload profile picture"
              >
                {authViewModel.user.thumbnailUrl ? (
                  <Image
                    src={authViewModel.user.thumbnailUrl}
                    alt={authViewModel.user.username}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-white shadow-lg object-cover"
                    priority
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {authViewModel.user.username?.charAt(0).toUpperCase() || authViewModel.user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Camera Overlay */}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  {authViewModel.isUploadingThumbnail ? (
                    <Upload className="w-8 h-8 text-white animate-bounce" />
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              
              {/* Upload Error Message */}
              {authViewModel.uploadError && (
                <p className="mt-2 text-sm text-red-600 text-center">
                  {authViewModel.uploadError}
                </p>
              )}
            </div>
          )}

          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            {authViewModel.user && (
              <p className="text-gray-700">
                Your Dashboard
              </p>
            )}
          </h1>

          <p className="text-gray-600">Manage your saved papers and research</p>
        </div>
          {/* Maps/Folders Section */}
          <div className="mb-6 mt-14">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => dashboardViewModel.setSelectedFolder(null)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full',
                  'backdrop-blur-sm border text-sm font-medium',
                  'shadow-md transition-all duration-200',
                  'hover:scale-105 hover:shadow-lg',
                  'px-4 py-2',
                  dashboardViewModel.selectedFolderId === null
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-white/80 text-gray-700 border-white/20 hover:bg-white'
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
                onClick={() => dashboardViewModel.setSelectedFolder(folder.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full',
                  'backdrop-blur-sm border text-sm font-medium',
                  'shadow-md transition-all duration-200',
                  'hover:scale-105 hover:shadow-lg',
                  'px-4 py-2',
                  dashboardViewModel.selectedFolderId === folder.id
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'bg-white/80 text-gray-700 border-white/20 hover:bg-white'
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
              className="p-2 text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-110"
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
            <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">
                {(() => {
                  const count = dashboardViewModel.selectedFolderId === null 
                    ? dashboardViewModel.uncategorizedCount 
                    : dashboardViewModel.selectedFolder?.paperCount || 0;
                  return `${count} ${count === 1 ? 'paper' : 'papers'}`;
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
                  Start saving papers from the search results to see them here.
                </p>
              </div>
            )}

          {/* Papers Grid */}
          {dashboardViewModel.filteredSavedPapers.length > 0 && (
            <div className="grid grid-cols-1 gap-6">
              {dashboardViewModel.filteredSavedPapers.map(savedPaper => (
                <div
                  key={savedPaper.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 group hover:shadow-xl hover:bg-white/90 relative"
                >
                  {/* Action Buttons - Top Right */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        citationViewModel.openPopup([savedPaper]);
                      }}
                      className="p-2 rounded-full transition-all duration-200 shadow-md text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300"
                      title="Get citation"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to remove this paper from your collection?')) {
                          dashboardViewModel.unsavePaper(savedPaper.id);
                        }
                      }}
                      className="p-2 rounded-full transition-all duration-200 shadow-md text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300"
                      title="Remove from collection"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="w-full text-left p-6 pr-24">
                    <div className="space-y-4">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors leading-tight">
                        {savedPaper.paper.title}
                      </h3>

                      {/* Authors */}
                      <p className="text-gray-600 font-medium text-base">
                        {savedPaper.paper.authors.join(', ')}
                      </p>

                      {/* Abstract */}
                      {savedPaper.paper.abstract && (
                        <p className="text-gray-700 leading-relaxed text-sm line-clamp-3">
                          {savedPaper.paper.abstract}
                        </p>
                      )}

                      {/* Metadata Tags */}
                      <div className="flex items-center flex-wrap gap-2 pt-2">
                        {savedPaper.paper.year && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {savedPaper.paper.year}
                          </span>
                        )}
                        {savedPaper.paper.venue && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            {savedPaper.paper.venue}
                          </span>
                        )}
                        {savedPaper.paper.citationCount !== undefined && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            {savedPaper.paper.citationCount} citations
                          </span>
                        )}
                        <span className="ml-auto text-xs text-gray-500">
                          Saved {new Date(savedPaper.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bulk Citation Button */}
          {dashboardViewModel.filteredSavedPapers.length > 1 && (
            <div className="text-center pt-4 pb-8">
              <button
                onClick={handleBulkCitation}
                className="mx-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
              >
                <FileText className="h-5 w-5" />
                Bulk Citation ({dashboardViewModel.filteredSavedPapers.length} papers)
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => dashboardViewModel.closeAddMapModal()}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FolderPlus className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-900">Create New Map</h2>
              </div>
              <button
                onClick={() => dashboardViewModel.closeAddMapModal()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <label htmlFor="map-name" className="block text-sm font-medium text-gray-700 mb-2">
                Map Name
              </label>
              <input
                id="map-name"
                type="text"
                value={dashboardViewModel.newMapName}
                onChange={(e) => dashboardViewModel.setNewMapName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    dashboardViewModel.createMap()
                  } else if (e.key === 'Escape') {
                    dashboardViewModel.closeAddMapModal()
                  }
                }}
                placeholder="e.g., Computer Vision, Machine Learning"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                autoFocus
              />
              <p className="mt-2 text-sm text-gray-500">
                Choose a descriptive name for your research map
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => dashboardViewModel.closeAddMapModal()}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => dashboardViewModel.createMap()}
                disabled={!dashboardViewModel.newMapName.trim()}
                className={cn(
                  "px-6 py-2 rounded-lg transition-all duration-200",
                  dashboardViewModel.newMapName.trim()
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
