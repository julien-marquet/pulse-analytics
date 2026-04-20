'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import e from 'express';
import { CalendarDays, ClockIcon, X } from 'lucide-react';
import { DateTime } from 'luxon';
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);
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
    <FieldGroup className="flex flex-row gap-2! items-end">
      <Field className="basis-auto">
        <FieldLabel htmlFor={`${id}-date`}>{label}</FieldLabel>
        <Popover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
          }}
        >
          <PopoverTrigger
            nativeButton={false}
            render={
              <ButtonGroup>
                <Button
                  variant="outline"
                  id={`${id}-date`}
                  className="relative flex-1 basis-full justify-start font-normal"
                >
                  {value === null ? (
                    <span>Pick a date</span>
                  ) : (
                    DateTime.fromJSDate(value).toFormat('yyyy LLL dd')
                  )}

                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3">
                    <CalendarDays className="text-muted-foreground/80" />
                    <span className="sr-only">Email</span>
                  </div>
                </Button>
                {value !== null && (
                  <Button
                    size="icon"
                    className={'basis auto'}
                    variant={'outline'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(null);
                    }}
                  >
                    <X />
                  </Button>
                )}
              </ButtonGroup>
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
      <Field className="basis-42">
        <div className="relative">
          <Input
            type="time"
            id={`${id}-time`}
            step="60"
            autoComplete="off" // https://github.com/vercel/next.js/discussions/21999
            disabled={value === null}
            onChange={(e) => handleTimeChange(e.target.value)}
            value={time ?? ''}
            className="peer appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          />
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
            <ClockIcon
              className="text-muted-foreground/80 w-4 h-4"
              aria-hidden="true"
            />
            <span className="sr-only">Email</span>
          </div>
        </div>
      </Field>
    </FieldGroup>
  );
}
