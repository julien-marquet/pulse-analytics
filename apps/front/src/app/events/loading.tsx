import { SkeletonTable } from '@/components/skeletons/SkeletonTable';
import { SkeletonFilters } from '@/components/skeletons/SkeletonFilters';

export default function Loading() {
  return (
    <div className={'flex flex-col gap-4'}>
      <SkeletonFilters />
      <SkeletonTable rows={25} cols={3} />
    </div>
  );
}
