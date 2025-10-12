import { cn } from '@/lib/utils'

interface LinkSmallProps {
  content: string
  href: string
  className?: string
}

export function LinkSmall({ content, href, className }: LinkSmallProps) {
  return (
    <a
      href={href}
      className={cn(
        'font-semibold leading-relaxed text-gray-700 underline hover:text-blue-700 dark:text-gray-200',
        className
      )}
    >
      {content}
    </a>
  )
}
