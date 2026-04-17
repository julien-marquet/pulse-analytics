'use client';

import * as React from 'react';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { DatePickerSimple } from './date-picker';
import { DateTime } from 'luxon';
import { SimpleCombobox } from './combo-box';

type FilterFormState = {
  type: string | null;
  from: Date | null;
  to: Date | null;
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
  console.log(action);
  switch (action.field) {
    case 'type':
      return { ...state, type: action.value };
    case 'from':
      if (action.value !== null && state.to !== null) {
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
      if (action.value !== null && state.from !== null) {
        let from = DateTime.fromJSDate(state.from);
        const to = DateTime.fromJSDate(action.value);
        if (from.diff(to).milliseconds > 0) {
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

type EventsFilterProps = { className?: string; eventTypes: string[] };

export function EventsFilters({ className, eventTypes }: EventsFilterProps) {
  const [formState, updateFormState] = React.useReducer(reducer, {
    type: null,
    from: null,
    to: null,
  });
  console.log(formState);
  return (
    <FieldGroup className={cn('grid grid-cols-3 gap-4', className)}>
      <Field>
        <FieldLabel htmlFor="type">Type</FieldLabel>
        <SimpleCombobox
          options={eventTypes}
          placeholder=""
          emptyMessage=""
          onChange={(type) => updateFormState({ field: 'type', value: type })}
        />
        {/* <Input
          id="type"
          value={formState.type}
          onChange={(e) =>
            updateFormState({ field: 'type', value: e.target.value })
          } */}
        {/* /> */}
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
