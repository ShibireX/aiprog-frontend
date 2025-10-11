import { cn } from '@/lib/utils'

interface InfoCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function InfoCard({
  icon,
  title,
  description,
  className,
}: InfoCardProps) {
  return (
    <div
      className={cn(
        'group rounded-3xl border-0 bg-white/40 p-8 shadow-lg backdrop-blur-sm dark:bg-slate-800/40',
        'transition-all duration-500 ease-out hover:bg-white/60 hover:shadow-xl dark:hover:bg-slate-800/70',
        'hover:-translate-y-1 hover:transform',
        className
      )}
    >
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-900 dark:text-gray-200">
            {title}
          </h3>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
