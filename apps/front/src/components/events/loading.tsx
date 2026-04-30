import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type LoadingChartProps = {
  transitionDuration: number;
  className?: string;
  children: ReactNode;
};
export function FadingSkeleton({
  className,
  children,
  transitionDuration,
}: LoadingChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          `absolute inset-0 transition-opacity duration-${transitionDuration}}`,
          mounted ? 'opacity-0 pointer-events-none' : 'opacity-100',
        )}
      >
        <Skeleton className="h-full w-full" />
      </div>
      <div
        className={cn(
          `w-full h-full transition-opacity duration-${transitionDuration}`,
          mounted ? 'opacity-100' : 'opacity-0',
        )}
      >
        {children}
      </div>
    </div>
  );
}
