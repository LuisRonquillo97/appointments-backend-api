/**
 * Cache service interface.
 */
export interface CacheService {
  /**
   * Get cache item.
   * @param key item to get.
   */
  get<T>(key: string): Promise<T | null>;
  /**
   * Set cache item.
   * @param key item to set.
   * @param value value to set.
   * @param ttlSeconds time to live in seconds.
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  /**
   * Delete cache item.
   * @param key item to delete.
   */
  delete(key: string): Promise<void>;
  /**
   * Clear cache.
   */
  clear(): Promise<void>;
}
