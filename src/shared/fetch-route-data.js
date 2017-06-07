import fetch from 'isomorphic-fetch'
import mitt from 'mitt'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import { errorObject } from '../utilities/logger'

mitt()

const fetchJSON = url => fetch(url).then(resp => resp.json())
const emitEvent = (event, data) => {
  if (typeof window !== 'undefined') {
    window.tapestryEmitter.emit(event, data)
  }
}

// handle promise resolution
const handleResolve = (resp, cb) => {
  emitEvent('dataStop', 'stop')
  cb(null, { data: resp })
}
const handleReject = (err, cb) => {
  emitEvent('dataStop', 'stop')
  errorObject(err)
  cb(err)
}

export default ({
  loadFrom,
  loadContext,
  cb
}) => {
  const origin = loadContext.serverUri || window.location.origin
  const baseUrl = `${origin}/api/v1`
  // kick off progress loader
  emitEvent('dataStart', 'start')
  // handle endpoint configurations
  if (isArray(loadFrom)) {
    // map out all endpoint requests
    const endpoints = loadFrom.map(endpoint => fetchJSON(`${baseUrl}/${endpoint}`))
    return Promise
      .all(endpoints)
      .then(resp => handleResolve(resp, cb))
      .catch(err => handleReject(err, cb))
  } else if (isObject(loadFrom)) {
    const endpoints = Object.keys(loadFrom).map(i => fetchJSON(`${baseUrl}/${loadFrom[i]}`))
    return Promise
      .all(endpoints)
      .then(resp => {
        const keys = Object.keys(loadFrom)
        return resp.reduce((prev, curr, i) => {
          prev[keys[i]] = resp[i]
          return prev
        }, {})
      })
      .then(resp => handleResolve(resp, cb))
      .catch(err => handleReject(err, cb))
  } else {
    return fetchJSON(`${baseUrl}/${loadFrom}`)
      .then(resp => handleResolve(resp, cb))
      .catch(err => handleReject(err, cb))
  }
}
