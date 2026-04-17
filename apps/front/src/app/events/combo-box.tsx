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
};
export function SimpleCombobox<T extends string[]>({
  options,
  emptyMessage,
  placeholder,
}: SimpleComboboxProps<T>) {
  return (
    <Combobox items={options}>
      <ComboboxInput placeholder={placeholder} />
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
