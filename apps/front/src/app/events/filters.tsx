'use client';

import * as React from 'react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { DatePickerSimple } from './date-picker';
import { DateTime } from 'luxon';

type FilterFormState = {
  type: string | undefined;
  from: Date | undefined;
  to: Date | undefined;
};

type FormAction = {
  [K in keyof FilterFormState]: {
    field: K;
    value: FilterFormState[K];
  };
}[keyof FilterFormState];

const defaultTimeTo = '23:59';
const defaultTimeFrom = '00:00';

function reducer(state: FilterFormState, action: FormAction) {
  switch (action.field) {
    case 'type':
      return { ...state, type: action.value };
    case 'from':
      if (action.value !== undefined && state.to !== undefined) {
        let to = DateTime.fromJSDate(state.to);
        const from = DateTime.fromJSDate(action.value);
        if (from.diff(to).milliseconds > 0) {
          const toTime = DateTime.fromFormat(defaultTimeTo, 'HH:mm');
          to = from.set({ hour: toTime.hour, minute: toTime.minute });
          return { ...state, from: action.value, to: to.toJSDate() };
        }
      }
      return { ...state, from: action.value };
    case 'to':
      if (action.value !== undefined && state.to !== undefined) {
        const to = DateTime.fromJSDate(state.to);
        let from = DateTime.fromJSDate(action.value);
        if (from.diff(to).milliseconds < 0) {
          const fromTime = DateTime.fromFormat(defaultTimeFrom, 'HH:mm');
          from = to
            .minus({ day: 1 })
            .set({ hour: fromTime.hour, minute: fromTime.minute });
          return { ...state, from: from.toJSDate(), to: action.value };
        }
      }
      return { ...state, to: action.value };
  }
}

type EventsFilterProps = { className?: string };
export function EventsFilters({ className }: EventsFilterProps) {
  const [formState, updateFormState] = React.useReducer(reducer, {
    type: undefined,
    from: undefined,
    to: undefined,
  });
  console.log(formState);
  return (
    <FieldGroup className={cn('grid grid-cols-3 gap-4', className)}>
      <Field>
        <FieldLabel htmlFor="type">Type</FieldLabel>
        <Input
          id="type"
          value={formState.type}
          onChange={(e) =>
            updateFormState({ field: 'type', value: e.target.value })
          }
        />
      </Field>
      <DatePickerSimple
        id="from"
        label="From"
        defaultTime={defaultTimeFrom}
        value={formState.from}
        onChange={(date) => updateFormState({ field: 'from', value: date })}
      />
      <DatePickerSimple
        id="to"
        label="To"
        defaultTime={defaultTimeTo}
        value={formState.to}
        onChange={(date) => updateFormState({ field: 'to', value: date })}
      />
    </FieldGroup>
  );
}
