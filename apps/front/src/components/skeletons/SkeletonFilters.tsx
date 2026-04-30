import { times } from '@/lib/utils';
import { Field, FieldGroup } from '../ui/field';
import { Skeleton } from '../ui/skeleton';

type SkeletonFiltersProps = {
  nFilters?: number;
};
export function SkeletonFilters({ nFilters = 3 }: SkeletonFiltersProps) {
  return (
    <FieldGroup className={'grid grid-cols-3 gap-4'}>
      {times(nFilters)((i) => (
        <Field key={i}>
          <Skeleton className="h-[19.25px] max-w-24" />
          <Skeleton className="h-9" />
        </Field>
      ))}
    </FieldGroup>
  );
}
