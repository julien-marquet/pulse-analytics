'use client';

import { useCallback } from 'react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import { StatsDefaultFilters, StatsFilters } from './types';
import { filtersToSearchParams } from './search-params';
import { DateInput } from '@/components/ui/date-input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type UpdatedStatsFilter = {
  [K in keyof StatsFilters]: {
    field: K;
    value: StatsFilters[K];
  };
}[keyof StatsFilters];

function reducer(
  currentValues: StatsFilters,
  updatedField: UpdatedStatsFilter,
  defaultValues: StatsDefaultFilters,
) {
  switch (updatedField.field) {
    case 'timezone':
      return { ...currentValues, timezone: updatedField.value };
    case 'from':
      {
        let to = currentValues.to
          ? DateTime.fromISO(currentValues.to)
          : DateTime.fromISO(defaultValues.to);
        const from = DateTime.fromISO(updatedField.value);
        if (from.diff(to, 'days').days > 0) {
          to = from;
          return {
            ...currentValues,
            from: updatedField.value,
            to: to.toISODate() as string,
          };
        }
      }
      return { ...currentValues, from: updatedField.value };
    case 'to':
      {
        let from = currentValues.from
          ? DateTime.fromISO(currentValues.from)
          : DateTime.fromISO(defaultValues.from);
        const to = DateTime.fromISO(updatedField.value);
        if (from.diff(to, 'days').days > 0) {
          from = to;
          return {
            ...currentValues,
            from: from.toISODate() as string,
            to: updatedField.value,
          };
        }
      }

      return { ...currentValues, to: updatedField.value };
  }
}

type PageFiltersProps = {
  className?: string;
  values: StatsFilters;
  defaultValues: StatsDefaultFilters;
  timezones: string[];
};

export function PageFilters({
  className,
  values,
  defaultValues,
  timezones,
}: PageFiltersProps) {
  const router = useRouter();

  const handleChange = useCallback(
    (action: UpdatedStatsFilter) => {
      const next = reducer(values, action, defaultValues);
      const params = filtersToSearchParams(next, defaultValues);
      router.push(`?${params.toString()}`);
    },
    [values, router, defaultValues],
  );

  return (
    <FieldGroup className={cn('grid grid-cols-3 gap-4', className)}>
      <Field>
        <FieldLabel htmlFor="from">From</FieldLabel>
        <DateInput
          id="from"
          value={DateTime.fromISO(values.from ?? defaultValues.from).toJSDate()}
          onChange={(date) =>
            handleChange({
              field: 'from',
              value: date
                ? (DateTime.fromJSDate(date).toISODate() as string)
                : defaultValues.from,
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="to">To</FieldLabel>
        <DateInput
          id="to"
          value={DateTime.fromISO(values.to ?? defaultValues.to).toJSDate()}
          onChange={(date) =>
            handleChange({
              field: 'to',
              value: date
                ? (DateTime.fromJSDate(date).toISODate() as string)
                : defaultValues.to,
            })
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
        <Select
          items={timezones.map((t) => ({ label: t, value: t }))}
          value={values.timezone ?? defaultValues.timezone}
          onValueChange={(nextValue) =>
            handleChange({
              field: 'timezone',
              value: nextValue ?? defaultValues.timezone,
            })
          }
        >
          <SelectTrigger id="timezone" aria-label="Timezone">
            <SelectValue placeholder="Select Timezone" />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {timezones.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
