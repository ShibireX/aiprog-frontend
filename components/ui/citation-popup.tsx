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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={citationViewModel.closePopup}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              {citationViewModel.selectedPapers.length === 1
                ? 'Citation'
                : 'Bulk Citations'}
            </h2>
            <span className="text-gray-500">
              ({citationViewModel.selectedPapers.length}{' '}
              {citationViewModel.selectedPapers.length === 1
                ? 'paper'
                : 'papers'}
              )
            </span>
          </div>
          <button
            onClick={citationViewModel.closePopup}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Select Citation Format
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {citationViewModel.availableFormats.map(format => (
                <button
                  key={format.id}
                  onClick={() => citationViewModel.setFormat(format.id)}
                  className={cn(
                    'rounded-lg border-2 p-4 text-left transition-all duration-200',
                    citationViewModel.selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div className="mb-1 font-medium text-gray-900">
                    {format.name}
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    {format.description}
                  </div>
                  <div className="text-xs italic text-gray-500">
                    {format.example}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mb-6 text-center">
            <button
              onClick={handleGenerate}
              disabled={citationViewModel.isGenerating}
              className="mx-auto flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                <h3 className="text-lg font-medium text-gray-900">
                  Generated Citations
                </h3>
                <button
                  onClick={handleCopy}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200',
                    copySuccess
                      ? 'border border-green-200 bg-green-100 text-green-700'
                      : 'border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
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

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800">
                  {citationViewModel.generatedCitations}
                </pre>
              </div>

              <div className="text-center text-xs text-gray-500">
                Citations generated in{' '}
                {
                  citationViewModel.availableFormats.find(
                    f => f.id === citationViewModel.selectedFormat
                  )?.name
                }{' '}
                format
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
