import { SkeletonFilters } from '@/components/skeletons/SkeletonFilters';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className={'flex flex-col gap-4'}>
      <SkeletonFilters />
      <div className="grid grid-cols-2 gap-4 ">
        <Skeleton className="col-span-2 h-100" />
        <Skeleton className="col-span-1 h-100" />
        <Skeleton className="col-span-1 h-100" />
        <Skeleton className="col-span-2 h-100" />
      </div>
    </div>
  );
}
