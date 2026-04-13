import { Item, ItemContent, ItemDescription, ItemTitle } from './item';

interface KpiItemProps {
  label: string;
  value: string;
  unit?: string;
  className?: string;
}

function KpiItem({ value, label, unit, className }: KpiItemProps) {
  return (
    <Item className={className} variant={'outline'}>
      <ItemContent className="flex items-center">
        <ItemDescription className="text-3xl font-bold text-foreground">
          {value} {unit}
        </ItemDescription>
        <ItemTitle className="font-bold text-muted-foreground">
          {label}
        </ItemTitle>
      </ItemContent>
    </Item>
  );
}

export { KpiItem };
