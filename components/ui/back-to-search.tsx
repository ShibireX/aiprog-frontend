import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function BackToSearch() {
  return (
    <div className="px-4 pt-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Link>
    </div>
  )
}

