import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { DateTime } from 'luxon';
import { DateInput } from './date-input';
import { TimeInput } from './time-input';

type DateTimeFieldGroupProps = {
  label: string;
  idPrefix: string;
  value: Date | null;
  disabled?: boolean;
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

export function DateTimeFieldGroup({
  label,
  idPrefix: id,
  value,
  onChange,
  disabled,
  defaultTime = '00:00',
}: DateTimeFieldGroupProps) {
  const time = value
    ? (DateTime.fromJSDate(value).toFormat('HH:mm') ?? null)
    : null;

  function handleTimeChange(nextTime: string | null) {
    if (!value) return;
    onChange(mergeDateAndTime(value, nextTime, defaultTime));
  }
  function handleDateChange(nextDate: Date | null) {
    if (nextDate === null) {
      onChange(null);
    } else {
      onChange(mergeDateAndTime(nextDate, time, defaultTime));
    }
  }

  return (
    <FieldGroup className="flex flex-row gap-2! items-end">
      <Field className="basis-auto">
        <FieldLabel htmlFor={`${id}-date`}>{label}</FieldLabel>
        <DateInput
          placeholder="Pick a date"
          disabled={disabled}
          id={`${id}-date`}
          onChange={handleDateChange}
          value={value}
        />
      </Field>
      <Field className="basis-44">
        <TimeInput
          id={`${id}-time`}
          onChange={(e) => handleTimeChange(e.target.value)}
          value={time}
          disabled={disabled || value === null}
        />
      </Field>
    </FieldGroup>
  );
}
