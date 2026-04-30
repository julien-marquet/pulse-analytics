import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toSearchParams<T extends object>(params: T): URLSearchParams {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined),
    ) as Record<string, string>,
  );
}

export function times<T extends (index: number) => any>(n: number) {
  return (f: T) => {
    const results = [];
    for (let i = 0; i < n; i++) {
      results.push(f(i));
    }
    return results;
  };
}
