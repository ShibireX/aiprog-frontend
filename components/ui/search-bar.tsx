'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  isLoading?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = '',
  className,
  autoFocus = false,
  isLoading = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [visiblePlaceholder, setVisiblePlaceholder] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholderExamples = [
    'HCI',
    'Computer Science',
    '3D Design',
    'Economics',
    'Law',
    'Machine Learning',
    'Climate Change',
    'Psychology',
  ];

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Initialize placeholder on mount
  useEffect(() => {
    setVisiblePlaceholder(placeholderExamples[0]);
  }, []);

  // Handle placeholder rotation with crossfade effect
  useEffect(() => {
    if (value || isFocused || placeholderExamples.length <= 1) return;

    const rotationInterval = setInterval(() => {
      setIsTransitioning(true);

      // Wait for fade out, then change text
      setTimeout(() => {
        const nextIndex = (placeholderIndex + 1) % placeholderExamples.length;
        setPlaceholderIndex(nextIndex);
        setVisiblePlaceholder(placeholderExamples[nextIndex]);

        // Reset transition state after a brief delay
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300); // Fade out duration
    }, 3000); // Rotation interval

    return () => clearInterval(rotationInterval);
  }, [placeholderIndex, value, isFocused, placeholderExamples]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch();
    }
  };

  return (
    <div className={cn('relative w-full max-w-3xl mx-auto', className)}>
      <div
        className={cn(
          'relative flex items-center rounded-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl transition-all duration-300',
          isFocused ? 'shadow-2xl ring-1 ring-blue-500/30 bg-white/90' : 'shadow-lg',
          'hover:shadow-xl hover:bg-white/85'
        )}
      >
        <div className="flex items-center pl-6">
          <svg
            className={cn(
              'h-6 w-6 transition-all duration-300',
              isFocused ? 'text-blue-600 scale-110' : 'text-gray-400'
            )}
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
        </div>
        
        {/* Custom placeholder with crossfade animation */}
        {!value && !isFocused && (
          <div 
            className="absolute left-[4.5rem] top-1/2 transform -translate-y-1/2 pointer-events-none z-10 text-lg text-gray-400 transition-opacity duration-300"
            style={{
              opacity: isTransitioning ? 0 : 1,
            }}
          >
            {visiblePlaceholder}
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={value || isFocused ? placeholder : ''}
          className={cn(
            'w-full px-6 py-5 text-lg text-gray-900 bg-transparent',
            'placeholder:text-gray-400 focus:outline-none',
            'border-0 rounded-2xl'
          )}
        />
        
        <div className="flex items-center space-x-2 pr-6">
          {value && !isLoading && (
            <button
              onClick={() => onChange('')}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
          ) : (
            <button
              onClick={onSearch}
              disabled={!value.trim()}
              className={cn(
                'p-2 rounded-xl transition-all duration-200',
                value.trim() 
                  ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
              type="button"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}
