/**
 * Pagination options interface.
 */
export interface PaginationOptions {
  /**
   * Current page.
   */
  page: number;
  /**
   * Number of records per page.
   */
  limit: number;
}

/**
 * Paginated result interface.
 */
export interface PaginatedResult<T> {
  /**
   * List of records.
   */
  records: T[];
  /**
   * Pagination metadata.
   */
  meta: {
    /**
     * Total pages.
     */
    total: number;
    /**
     * Current page.
     */
    page: number;
    /**
     * Number of records per page.
     */
    limit: number;
    /**
     * Total number of pages.
     */
    totalPages: number;
  };
}
