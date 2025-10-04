'use client'

import { X, Folder, FolderPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchViewModel } from '@/lib/viewmodels/search-viewmodel'

interface FolderSelectionPopupProps {
  searchViewModel: SearchViewModel
}

export function FolderSelectionPopup({ searchViewModel }: FolderSelectionPopupProps) {
  if (!searchViewModel.isSelectingFolder) return null

  const showCreateFolder = searchViewModel.newFolderName.length > 0

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => searchViewModel.closeFolderSelection()}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Folder className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Select Folder</h2>
          </div>
          <button
            onClick={() => searchViewModel.closeFolderSelection()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {!showCreateFolder ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Choose a folder to save this paper to:
              </p>

              {/* Folder List */}
              <div className="space-y-2 mb-4">
                {/* Uncategorized Option */}
                <button
                  onClick={() => searchViewModel.savePaperToFolder(searchViewModel.selectedPaperToSave!, null)}
                  className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Uncategorized</span>
                  </div>
                </button>

                {/* Existing Folders */}
                {searchViewModel.folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => searchViewModel.savePaperToFolder(searchViewModel.selectedPaperToSave!, folder.id)}
                    className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">{folder.name}</span>
                      <span className="ml-auto text-sm text-gray-500">
                        {folder.paperCount} {folder.paperCount === 1 ? 'paper' : 'papers'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Create New Folder Button */}
              <button
                onClick={() => searchViewModel.setNewFolderName(' ')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-gray-600 hover:text-blue-600"
              >
                <FolderPlus className="h-5 w-5" />
                <span className="font-medium">Create New Folder</span>
              </button>
            </>
          ) : (
            <>
              {/* Create Folder Form */}
              <p className="text-sm text-gray-600 mb-4">
                Create a new folder for this paper:
              </p>

              <input
                type="text"
                value={searchViewModel.newFolderName}
                onChange={(e) => searchViewModel.setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    searchViewModel.createFolderAndSave()
                  } else if (e.key === 'Escape') {
                    searchViewModel.setNewFolderName('')
                  }
                }}
                placeholder="e.g., Machine Learning, HCI Research"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                autoFocus
              />

              {/* Buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => searchViewModel.setNewFolderName('')}
                  className="flex-1 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => searchViewModel.createFolderAndSave()}
                  disabled={!searchViewModel.newFolderName.trim()}
                  className={cn(
                    "flex-1 px-6 py-2 rounded-lg transition-all duration-200",
                    searchViewModel.newFolderName.trim()
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  )}
                >
                  Create & Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

