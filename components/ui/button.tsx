import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonProps {
  description: string
  className?: string
  link?: string
}

export function Button({ description, link = '/' }: ButtonProps) {
  return (
    <>
      <Link
        className={cn(
          'flex h-12 w-24 items-center justify-center rounded-2xl',
          'bg-gradient-to-br from-blue-500 to-blue-600 font-medium text-white',
          'shadow-lg transition-all duration-300',
          'group-hover:scale-105 group-hover:shadow-xl',
          'transition-all duration-500 ease-out hover:shadow-xl',
          'hover:-translate-y-1 hover:transform',
          'm-4'
        )}
        href={link}
      >
        {description}
      </Link>
    </>
  )
}
