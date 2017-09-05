import chalk from 'chalk'
import LRU from 'lru-cache'
import { log } from '../utilities/logger'

let internalCaches = []
let instance = null

export const stripLeadingTrailingSlashes = path => {
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
      max: parseInt(process.env.CACHE_MAX_ITEM_COUNT, 10) || 100,
      maxAge: parseInt(process.env.CACHE_MAX_AGE, 10) || 1
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

    log.debug(`Cache cleared ${chalk.green(keyName)} in ${chalk.green(cacheName)}`)
    log.silly(JSON.stringify(internalCaches, null, 2))

    internalCaches[cacheName].del(keyName)
  }
}
