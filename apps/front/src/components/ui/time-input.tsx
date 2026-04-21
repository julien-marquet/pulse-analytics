import { ClockIcon } from 'lucide-react';
import { Input } from './input';
import { ChangeEvent } from 'react';

type TimeInputProps = {
  id: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  value?: string | null;
};

export function TimeInput({ id, onChange, disabled, value }: TimeInputProps) {
  return (
    <div className="relative">
      <Input
        type="time"
        id={id}
        step="60"
        autoComplete="off" // https://github.com/vercel/next.js/discussions/21999
        disabled={disabled}
        onChange={onChange}
        value={value ?? ''}
        className="peer appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 peer-disabled:opacity-50">
        <ClockIcon
          className="text-muted-foreground/80 w-4 h-4"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
