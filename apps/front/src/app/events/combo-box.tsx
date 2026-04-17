import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

type SimpleComboboxProps<T extends string[]> = {
  options: T;
  placeholder: string;
  emptyMessage: string;
  onChange: (nextValue: string | null) => void;
};
export function SimpleCombobox<T extends string[]>({
  options,
  emptyMessage,
  placeholder,
  onChange,
}: SimpleComboboxProps<T>) {
  return (
    <Combobox<string> onValueChange={onChange} items={options}>
      <ComboboxInput placeholder={placeholder} showClear />
      <ComboboxContent>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
