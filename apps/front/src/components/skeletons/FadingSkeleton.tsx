'use client';

import { cn } from '@/lib/utils';
import { ReactNode, useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

type LoadingChartProps = {
  transitionDuration?: number;
  className?: string;
  children: ReactNode;
};
export function FadingSkeleton({
  className,
  children,
  transitionDuration = 200,
}: LoadingChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn('relative', className)}>
      <div
        style={{ transitionDuration: `${transitionDuration}ms` }}
        className={cn(
          'absolute inset-0 transition-opacity',
          mounted ? 'opacity-0 pointer-events-none' : 'opacity-100',
        )}
      >
        <Skeleton className="h-full w-full" />
      </div>
      <div
        style={{ transitionDuration: `${transitionDuration}ms` }}
        className={cn(
          `w-full h-full transition-opacity`,
          mounted ? 'opacity-100' : 'opacity-0',
        )}
      >
        {children}
      </div>
    </div>
  );
}
