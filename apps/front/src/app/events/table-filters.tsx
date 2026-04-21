'use client';

import { useCallback } from 'react';
import { FieldGroup } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { DateTimeFieldGroup } from '../../components/ui/date-time-field-group';
import { DateTime } from 'luxon';
import { useRouter, useSearchParams } from 'next/navigation';
import Combobox from '../../components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { filtersToSearchParams } from './search-params';
import { defaultTimeFrom, defaultTimeTo } from './consts';
import { EventsFilters } from './types';

type FieldsValues = Pick<EventsFilters, 'from' | 'to' | 'type'>;

type UpdatedField = {
  [K in keyof FieldsValues]: {
    field: K;
    value: FieldsValues[K];
  };
}[keyof FieldsValues];

function reducer(currentValues: FieldsValues, updatedField: UpdatedField) {
  switch (updatedField.field) {
    case 'type':
      return { ...currentValues, type: updatedField.value };
    case 'from':
      if (updatedField.value !== null && currentValues.to !== null) {
        let to = DateTime.fromJSDate(currentValues.to);
        const from = DateTime.fromJSDate(updatedField.value);
        if (from.diff(to).milliseconds > 0) {
          const toTime = DateTime.fromFormat(defaultTimeTo, 'HH:mm');
          to = from.set({ hour: toTime.hour, minute: toTime.minute });
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
        if (from.diff(to).milliseconds > 0) {
          const fromTime = DateTime.fromFormat(defaultTimeFrom, 'HH:mm');
          from = to
            .minus({ day: 1 })
            .set({ hour: fromTime.hour, minute: fromTime.minute });
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

type TableFilterProps = {
  className?: string;
  eventTypes: string[];
  values: FieldsValues;
};

export function TableFilters({
  className,
  eventTypes,
  values,
}: TableFilterProps) {
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
      <Combobox
        options={eventTypes}
        selectedValues={values.type ?? []}
        onChange={(type) => handleChange({ field: 'type', value: type })}
        emptyOptionsLabel="No type found"
        id="type"
        label="Type"
        placeholder="Select some types"
        getSelectedMessage={(nSelected) => (
          <span>
            <Badge variant="outline" className="rounded-sm">
              {nSelected}
            </Badge>{' '}
            {'selected'}
          </span>
        )}
      />
      <DateTimeFieldGroup
        idPrefix="from"
        label="From"
        defaultTime={defaultTimeFrom}
        value={values.from}
        onChange={(date) => handleChange({ field: 'from', value: date })}
      />
      <DateTimeFieldGroup
        idPrefix="to"
        label="To"
        defaultTime={defaultTimeTo}
        value={values.to}
        onChange={(date) => handleChange({ field: 'to', value: date })}
      />
    </FieldGroup>
  );
}
