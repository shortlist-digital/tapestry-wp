import chalk from 'chalk'
import LRU from 'lru-cache'
import log from '../utilities/logger'

let internalCaches = []
let instance = null

export const normalizePath = path => {
  if (path !== '/') {
    return path.replace(/^\/+|\/+$/g, '')
  }
  return path
}

export default class CacheManager {


  constructor() {
    if (instance) {
      return instance
    }
    this.clearAll = this.clearAll.bind(this)
    this.createCache = this.createCache.bind(this)
    this.instance = this
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
    log.debug(`purging ${chalk.green(keyName)} from cache: ${chalk.green(cacheName)}`)
    log.silly(JSON.stringify(internalCaches, null, 2))
    const cacheStatus = internalCaches[cacheName].del(keyName) || 'not found'
    log.debug(`Clear status for \`${chalk.green(keyName)}\`:`, cacheStatus)
  }
}
