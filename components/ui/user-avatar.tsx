import Link from 'next/link'
import { User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  className?: string
  link?: string
}

export function UserAvatar({ link = '/dashboard', className }: UserAvatarProps) {
  return (
    <Link 
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-full',
        'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
        'shadow-lg transition-all duration-300',
        'hover:scale-105 hover:shadow-xl',
        'hover:transform hover:-translate-y-1',
        'm-4',
        className
      )} 
      href={link}
    >
      <User className="h-6 w-6" />
    </Link>
  )
}
