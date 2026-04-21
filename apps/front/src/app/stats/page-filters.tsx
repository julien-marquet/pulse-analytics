'use client';

import { useCallback } from 'react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { DateTime } from 'luxon';
import { useRouter, useSearchParams } from 'next/navigation';
import { StatsFilters } from './types';
import { filtersToSearchParams } from './search-params';
import { DateInput } from '@/components/ui/date-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type FieldsValues = StatsFilters;

type UpdatedField = {
  [K in keyof FieldsValues]: {
    field: K;
    value: FieldsValues[K];
  };
}[keyof FieldsValues];

function reducer(currentValues: FieldsValues, updatedField: UpdatedField) {
  switch (updatedField.field) {
    case 'from':
      if (updatedField.value !== null && currentValues.to !== null) {
        let to = DateTime.fromJSDate(currentValues.to);
        const from = DateTime.fromJSDate(updatedField.value);
        if (from.diff(to, 'days').days > 0) {
          to = from;
          return {
            ...currentValues,
            from: updatedField.value,
            to: to.toJSDate(),
          };
        }
      }
      return { ...currentValues, from: updatedField.value };
    case 'to':
      if (updatedField.value !== null && currentValues.from !== null) {
        let from = DateTime.fromJSDate(currentValues.from);
        const to = DateTime.fromJSDate(updatedField.value);
        if (from.diff(to, 'days').days > 0) {
          from = to;
          return {
            ...currentValues,
            from: from.toJSDate(),
            to: updatedField.value,
          };
        }
      }
      return { ...currentValues, to: updatedField.value };
  }
}

type PageFiltersProps = {
  className?: string;
  values: FieldsValues;
};

export function PageFilters({ className, values }: PageFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (action: UpdatedField) => {
      const next = reducer(values, action);
      const params = filtersToSearchParams(searchParams, next);
      router.push(`?${params.toString()}`);
    },
    [values, router, searchParams],
  );
  return (
    <FieldGroup className={cn('grid grid-cols-3 gap-4', className)}>
      <Field>
        <FieldLabel htmlFor="from">From</FieldLabel>
        <DateInput
          id="from"
          value={values.from}
          onChange={(date) => handleChange({ field: 'from', value: date })}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="to">To</FieldLabel>
        <DateInput
          id="to"
          value={values.to}
          onChange={(date) => handleChange({ field: 'to', value: date })}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
        <Select value={'UTC'}>
          <SelectTrigger
            id="timezone"
            className="w-fit whitespace-nowrap"
            aria-label="Results per page"
          >
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'UTC'}>UTC</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
