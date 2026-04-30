'use client';

import { ReactNode, useState } from 'react';
import { ChevronsUpDownIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Field, FieldLabel } from '@/components/ui/field';
import { ButtonGroup } from './button-group';

type Props = {
  id: string;
  options: string[];
  selectedValues: string[];
  label: string;
  placeholder: string;
  emptyOptionsLabel: string;
  getSelectedMessage: (nSelected: number) => ReactNode;
  onChange: (values: string[]) => void;
};

export default function Combobox({
  options,
  onChange,
  selectedValues,
  id,
  getSelectedMessage,
  label,
  emptyOptionsLabel,
  placeholder,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggleSelection = (value: string) => {
    onChange(
      selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value],
    );
  };

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          nativeButton={false}
          render={
            <ButtonGroup>
              <Button
                id={id}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between basis-full flex-1"
              >
                {selectedValues.length > 0 ? (
                  getSelectedMessage(selectedValues.length)
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
                <ChevronsUpDownIcon
                  className="text-muted-foreground/80 shrink-0"
                  aria-hidden="true"
                />
              </Button>
              {selectedValues.length > 0 && (
                <Button
                  size="icon"
                  variant={'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                >
                  <X />
                </Button>
              )}
            </ButtonGroup>
          }
        ></PopoverTrigger>
        <PopoverContent className="w-(--anchor-width) p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{emptyOptionsLabel}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => toggleSelection(option)}
                    checked={selectedValues.includes(option)}
                  >
                    <span className="truncate">{option}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Field>
  );
}
