'use client'

import { useState } from 'react'
import { X, Copy, CheckCircle, FileText, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CitationViewModel } from '@/lib/viewmodels/citation-viewmodel'

interface CitationPopupProps {
  citationViewModel: CitationViewModel
}

export function CitationPopup({ citationViewModel }: CitationPopupProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  if (!citationViewModel.isOpen) return null

  const handleCopy = async () => {
    const success = await citationViewModel.copyToClipboard()
    if (success) {
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const handleGenerate = () => {
    citationViewModel.generateCitations()
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={citationViewModel.closePopup}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Bulk Citations</h2>
            <span className="text-gray-500">({citationViewModel.selectedPapers.length} papers)</span>
          </div>
          <button
            onClick={citationViewModel.closePopup}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Citation Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {citationViewModel.availableFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => citationViewModel.setFormat(format.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all duration-200",
                    citationViewModel.selectedFormat === format.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="font-medium text-gray-900 mb-1">{format.name}</div>
                  <div className="text-sm text-gray-600 mb-2">{format.description}</div>
                  <div className="text-xs text-gray-500 italic">{format.example}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mb-6 text-center">
            <button
              onClick={handleGenerate}
              disabled={citationViewModel.isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
            >
              {citationViewModel.isGenerating ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Generate Citations
                </>
              )}
            </button>
          </div>

          {/* Generated Citations */}
          {citationViewModel.generatedCitations && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Generated Citations</h3>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    copySuccess
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  )}
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy All
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                  {citationViewModel.generatedCitations}
                </pre>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Citations generated in {citationViewModel.availableFormats.find(f => f.id === citationViewModel.selectedFormat)?.name} format
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
