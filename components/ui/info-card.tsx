import { cn } from '@/lib/utils';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function InfoCard({ icon, title, description, className }: InfoCardProps) {
  return (
    <div
      className={cn(
        'group p-8 bg-white/40 backdrop-blur-sm rounded-3xl border-0 shadow-lg',
        'hover:bg-white/60 hover:shadow-xl transition-all duration-500 ease-out',
        'hover:transform hover:-translate-y-1',
        className
      )}
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
