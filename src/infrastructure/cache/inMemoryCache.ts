// src/infrastructure/cache/inMemoryCache.ts
import { CacheService } from './cacheService';

interface CacheItem<T> {
  value: T;
  expiry?: number;
}

export class InMemoryCache implements CacheService {
  private cache: Map<string, CacheItem<any>> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const item: CacheItem<T> = {
      value,
      expiry: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined,
    };

    this.cache.set(key, item);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}
