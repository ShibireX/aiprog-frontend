'use client'

import { X, Folder, FolderPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchViewModel } from '@/lib/viewmodels/search-viewmodel'

interface FolderSelectionPopupProps {
  searchViewModel: SearchViewModel
}

export function FolderSelectionPopup({
  searchViewModel,
}: FolderSelectionPopupProps) {
  if (!searchViewModel.isSelectingFolder) return null

  const showCreateFolder = searchViewModel.newFolderName.length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => searchViewModel.closeFolderSelection()}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Select Folder
            </h2>
          </div>
          <button
            onClick={() => searchViewModel.closeFolderSelection()}
            className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {!showCreateFolder ? (
            <>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Choose a folder to save this paper to:
              </p>

              {/* Folder List */}
              <div className="mb-4 space-y-2">
                {/* Uncategorized Option */}
                <button
                  onClick={() =>
                    searchViewModel.savePaperToFolder(
                      searchViewModel.selectedPaperToSave!,
                      null
                    )
                  }
                  className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-left transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/30"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      Uncategorized
                    </span>
                  </div>
                </button>

                {/* Existing Folders */}
                {searchViewModel.folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() =>
                      searchViewModel.savePaperToFolder(
                        searchViewModel.selectedPaperToSave!,
                        folder.id
                      )
                    }
                    className="w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-left transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/30"
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {folder.name}
                      </span>
                      <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                        {folder.paperCount}{' '}
                        {folder.paperCount === 1 ? 'paper' : 'papers'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Create New Folder Button */}
              <button
                onClick={() => searchViewModel.setNewFolderName(' ')}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-gray-600 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
              >
                <FolderPlus className="h-5 w-5" />
                <span className="font-medium">Create New Folder</span>
              </button>
            </>
          ) : (
            <>
              {/* Create Folder Form */}
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                Create a new folder for this paper:
              </p>

              <input
                type="text"
                value={searchViewModel.newFolderName}
                onChange={e => searchViewModel.setNewFolderName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    searchViewModel.createFolderAndSave()
                  } else if (e.key === 'Escape') {
                    searchViewModel.setNewFolderName('')
                  }
                }}
                placeholder="e.g., Machine Learning, HCI Research"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                autoFocus
              />

              {/* Buttons */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => searchViewModel.setNewFolderName('')}
                  className="flex-1 rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Back
                </button>
                <button
                  onClick={() => searchViewModel.createFolderAndSave()}
                  disabled={!searchViewModel.newFolderName.trim()}
                  className={cn(
                    'flex-1 rounded-lg px-6 py-2 transition-all duration-200',
                    searchViewModel.newFolderName.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg'
                      : 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500'
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
