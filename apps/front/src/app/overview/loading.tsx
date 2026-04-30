import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <Skeleton className="w-full h-[89.25px]" />
        <Skeleton className="w-full h-[89.25px]" />
        <Skeleton className="w-full h-[89.25px]" />
        <Skeleton className="w-full h-[89.25px]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="w-full h-100" />
        <Skeleton className="w-full h-100" />
      </div>
    </div>
  );
}
