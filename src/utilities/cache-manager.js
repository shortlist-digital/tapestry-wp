import chalk from 'chalk'
import NCM from 'cache-manager'
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
    const count = parseInt(process.env.CACHE_MAX_ITEM_COUNT, 10) || 100
    const maxAge = parseInt(process.env.CACHE_MAX_AGE, 10) || 1
    internalCaches[name] = NCM.caching({
      store: 'memory',
      max: count,
      ttl: maxAge
    })
    return internalCaches[name]
  }

  clearAll() {
    if (internalCaches) {
      internalCaches.forEach(async (cache) =>
        await cache.reset()
      )
    }
  }

  getCache(name) {
    return internalCaches[name]
  }

  async clearCache(cacheName, keyName) {

    log.debug(`Cache cleared ${chalk.green(keyName)} in ${chalk.green(cacheName)}`)
    log.silly(JSON.stringify(internalCaches, null, 2))

    await internalCaches[cacheName].del(keyName)
  }
}
