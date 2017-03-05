import LRU from 'lru-cache'

const internalCaches = []

export default class CacheManager {

  static createCache(name) {
    internalCaches[name] = LRU({
      max: 100,
      maxAge: process.env.CACHE_MAX_AGE || 1000*60*2
    })
    return internalCaches[name]
  }

  static clearAll() {
    internalCaches.forEach(cache =>
      cache.reset()
    )
  }
}
