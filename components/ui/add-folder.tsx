import Link from 'next/link'
import {  FolderPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface FolderProps {
  className?: string
  link?: string
}

export function AddFolderIcon({ link = '/dashboard', className }: FolderProps) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full',
        'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
        'shadow-lg transition-all duration-300',
        'hover:scale-105 hover:shadow-xl',
        'hover:-translate-y-1 hover:transform',
        'm-4',
        className
      )}
    >
      <FolderPlus />
    </div>
  )
}
