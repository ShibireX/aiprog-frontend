import { Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaperFolderProps {
  className?: string
  text?: string
}

export function PaperFolderIcon({ text = 'PaperFolder', className }: PaperFolderProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full',
        'backdrop-blur-sm border border-white/20 text-gray-700',
        'shadow-lg transition-all duration-300',
        'hover:scale-105 hover:shadow-xl',
        'hover:-translate-y-1 hover:transform',
        'px-4 py-2 m-4',
        className
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center">
        <Folder className="h-5 w-5" />
      </span>
      <span className="whitespace-nowrap text-sm font-medium pr-2">{text}</span>
    </div>
  )
}
