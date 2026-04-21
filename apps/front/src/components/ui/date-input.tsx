import { DateTime } from 'luxon';
import { Button } from './button';
import { ButtonGroup } from './button-group';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { CalendarDays, X } from 'lucide-react';
import { Calendar } from './calendar';
import { useState } from 'react';

type DateInputProps = {
  id: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function DateInput({
  id,
  value,
  onChange,
  placeholder,
  disabled,
}: DateInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <PopoverTrigger
        disabled={disabled}
        nativeButton={false}
        render={
          <ButtonGroup>
            <Button
              disabled={disabled}
              variant="outline"
              id={id}
              className="relative flex-1 basis-full justify-start font-normal"
            >
              {value === null ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                DateTime.fromJSDate(value).toFormat('yyyy LLL dd')
              )}

              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3">
                <CalendarDays className="text-muted-foreground/80" />
              </div>
            </Button>
            {value !== null && (
              <Button
                disabled={disabled}
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
          onSelect={(date) => onChange(date ?? null)}
          defaultMonth={value ?? undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
