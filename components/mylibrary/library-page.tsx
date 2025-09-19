'use client';

import { InfoCard } from '@/components/ui/info-card';
import { useLibraryViewModel } from '@/lib/viewmodels/mylibrary-viewmodel';

export function LibraryPage() {
  const libraryViewModel = useLibraryViewModel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Header Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-6">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 sm:text-7xl mb-2 tracking-tight">
                Papr
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
              Here you can view your current papers 
            </p>
          </div>
          
          
          
          {libraryViewModel.error && (
            <div className="mt-6 max-w-2xl mx-auto">
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
                <p className="text-red-700 text-center">{libraryViewModel.error}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 pb-20 sm:px-6 lg:px-8">
        {!libraryViewModel.results ? (
          <div className="space-y-16">
            {/* About Papr Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Revolutionizing Scientific Discovery
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
                Papr harnesses the power of artificial intelligence to transform how students and researchers discover, 
                analyze, and connect scientific publications across disciplines
              </p>
            </div>

       
            
            </div>
          ) : libraryViewModel.results ? (
            <SearchResults results={libraryViewModel.results} />
          ) : null}
      </div>
    </div>
  );
}
