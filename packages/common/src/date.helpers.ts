export function roundDateToDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}