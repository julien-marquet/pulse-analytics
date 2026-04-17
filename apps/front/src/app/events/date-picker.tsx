'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DateTime } from 'luxon';

type DatePickerSimpleProps = {
  label: string;
  id: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  defaultTime?: string;
};

function mergeDateAndTime(
  date: Date,
  time: string | null,
  defaultTime: string,
) {
  const dateTime = DateTime.fromJSDate(date).startOf('day');
  const parsedTime = time
    ? DateTime.fromFormat(time, 'HH:mm')
    : DateTime.fromFormat(defaultTime, 'HH:mm');
  return dateTime
    .set({
      hour: parsedTime.hour,
      minute: parsedTime.minute,
    })
    .toJSDate();
}

export function DatePickerSimple({
  label,
  id,
  value,
  onChange,
  defaultTime = '00:00',
}: DatePickerSimpleProps) {
  const time = value
    ? (DateTime.fromJSDate(value).toFormat('HH:mm') ?? null)
    : null;

  function handleTimeChange(nextTime: string | null) {
    if (!value) return;
    onChange(mergeDateAndTime(value, nextTime, defaultTime));
  }
  function handleDateChange(nextDate: Date) {
    onChange(mergeDateAndTime(nextDate, time, defaultTime));
  }

  return (
    <FieldGroup className="grid grid-cols-3 gap-2!">
      <Field className="col-span-2">
        <FieldLabel htmlFor={`${id}-date`}>{label}</FieldLabel>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id={`${id}-date`}
                className="justify-start font-normal"
              >
                {value ? (
                  DateTime.fromJSDate(value).toFormat('yyyy LLL dd')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={handleDateChange}
              defaultMonth={value ?? undefined}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="col-span-1 justify-end">
        <Input
          type="time"
          id={`${id}-time`}
          step="60"
          autoComplete="off" // https://github.com/vercel/next.js/discussions/21999
          disabled={value === null}
          onChange={(e) => handleTimeChange(e.target.value)}
          value={time ?? ''}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}
