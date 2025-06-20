export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  records: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
