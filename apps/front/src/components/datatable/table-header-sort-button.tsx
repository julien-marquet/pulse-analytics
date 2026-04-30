import { Button } from '@/components/ui/button';
import { SortDesc, SortAsc } from 'lucide-react';

type TableHeaderSortButtonProps<T extends string> = {
  label: string;
  field: T;
  activeField: T | null;
  activeFieldAsc: boolean | null;
  onClick: (sortBy: T, sortAsc: boolean) => void;
};
export default function TableHeaderSortButton<T extends string>({
  label,
  activeField,
  activeFieldAsc,
  field,
  onClick,
}: TableHeaderSortButtonProps<T>) {
  const nextAsc = getNextSortAsc();

  function getNextSortAsc() {
    if (activeField !== field) return false;
    return !activeFieldAsc;
  }

  function renderIcon() {
    if (activeField != field) {
      return <SortDesc className="ml-2 h-4 w-4 text-faint-foreground" />;
    }
    if (activeFieldAsc) {
      return <SortAsc className="ml-2 h-4 w-4" />;
    }
    return <SortDesc className="ml-2 h-4 w-4" />;
  }
  return (
    <Button
      className={'-m-1.5 px-1 cursor-pointer'}
      variant="ghost"
      onClick={() => onClick(field, nextAsc)}
    >
      {label}
      {renderIcon()}
    </Button>
  );
}
