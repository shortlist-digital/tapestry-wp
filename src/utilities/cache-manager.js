import LRU from 'lru-cache'
import winston from 'winston'

let cacheManagerInstance = null
let internalCaches = []

export default () => {

  class CacheManager {
    constructor() {
      if(!cacheManagerInstance){
        cacheManagerInstance = this
      }
      this.clearAll = this.clearAll.bind(this)
    }

    createCache(name) {
      internalCaches[name] = LRU({
        max: 100,
        maxAge: (process.env.NODE_ENV === 'production') ?
          (process.env.CACHE_MAX_AGE || 1000*60*2) : 1
      })
      return internalCaches[name]
    }

    clearAll() {
      if (internalCaches) {
        internalCaches.forEach(cache =>
          cache.reset()
        )
      }
    }

    getCache(name) {
      return internalCaches[name]
    }

    clearCache(cacheName, keyName) {
      winston.debug(`purging ${keyName} from cache: ${cacheName}`)
      winston.silly(JSON.stringify(internalCaches, null, 2))
      winston.debug(`Clear status for \`${keyName}\`:`, internalCaches[cacheName].del(keyName) || 'not found')
    }
  }

  return new CacheManager()
}
