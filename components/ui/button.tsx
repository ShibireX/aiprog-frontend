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
    <Link className={cn(
          'flex h-12 w-24 items-center justify-center rounded-2xl',
          'bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium',
          'shadow-lg transition-all duration-300',
          'group-hover:scale-105 group-hover:shadow-xl',
          'hover:shadow-xl transition-all duration-500 ease-out',
          'hover:transform hover:-translate-y-1',
          'm-4'
        )} href={link}>{description}</Link>
    
    </>

  )
}
