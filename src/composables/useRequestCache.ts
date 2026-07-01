import { ref, watch } from "vue";

interface CacheOptions {
  maxAge?: number;
  maxSize?: number;
}

interface CacheItem {
  data: any;
  timestamp: number;
}

const defaultOptions: Required<CacheOptions> = {
  maxAge: 5 * 60 * 1000,
  maxSize: 200,
};

function generateKey(url: string, params: any = {}): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc: Record<string, any>, key) => {
      acc[key] = params[key];
      return acc;
    }, {});
  return url + JSON.stringify(sortedParams);
}

export function useRequestCache(options: CacheOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  const cache = new Map<string, CacheItem>();

  const hitCount = ref(0);
  const missCount = ref(0);

  function get(key: string): any | null {
    const item = cache.get(key);
    if (!item) {
      missCount.value++;
      return null;
    }

    if (Date.now() - item.timestamp > opts.maxAge) {
      cache.delete(key);
      missCount.value++;
      return null;
    }

    hitCount.value++;
    return item.data;
  }

  function set(key: string, data: any): void {
    if (cache.size >= opts.maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  function clear(): void {
    cache.clear();
  }

  function invalidate(pattern: string): void {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  }

  const hitRate = ref(0);
  watch([hitCount, missCount], () => {
    const total = hitCount.value + missCount.value;
    hitRate.value = total > 0 ? Math.round((hitCount.value / total) * 100) : 0;
  });

  return {
    get,
    set,
    clear,
    invalidate,
    generateKey,
    hitCount,
    missCount,
    hitRate,
  };
}

export function createCachedRequest(
  requestFn: (params?: any) => Promise<any>,
  options: CacheOptions = {}
) {
  const cache = useRequestCache(options);

  async function cachedRequest(params?: any): Promise<any> {
    const key = cache.generateKey(requestFn.name || "request", params);
    const cached = cache.get(key);
    if (cached) {
      return Promise.resolve(cached);
    }

    const result = await requestFn(params);
    cache.set(key, result);
    return result;
  }

  cachedRequest.clearCache = () => cache.clear();
  cachedRequest.invalidateCache = (pattern: string) =>
    cache.invalidate(pattern);
  cachedRequest.getCacheStats = () => ({
    hit: cache.hitCount.value,
    miss: cache.missCount.value,
    rate: cache.hitRate.value,
  });

  return cachedRequest;
}
