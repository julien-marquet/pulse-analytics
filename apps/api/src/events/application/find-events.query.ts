import { SortableEventField } from './event.finder';

export const MIN_PAGE_SIZE = 5;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE_SIZE = 50;

export class FindEventsQuery {
  private constructor(
    public readonly page: number,
    public readonly pageSize: number,
    public readonly type?: string[],
    public readonly from?: Date,
    public readonly to?: Date,
    public readonly sortBy?: SortableEventField,
    public readonly sortAsc?: boolean,
  ) {}

  static create(params: {
    page: number;
    pageSize?: number;
    type?: string[];
    from?: Date;
    to?: Date;
    sortBy?: SortableEventField;
    sortAsc?: boolean;
  }): FindEventsQuery {
    const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
    if (pageSize < MIN_PAGE_SIZE || pageSize > MAX_PAGE_SIZE) {
      throw new Error(
        `pageSize must be between ${MIN_PAGE_SIZE} and ${MAX_PAGE_SIZE}`,
      );
    }
    return new FindEventsQuery(
      params.page,
      pageSize,
      params.type,
      params.from,
      params.to,
      params.sortBy,
      params.sortAsc,
    );
  }
}
