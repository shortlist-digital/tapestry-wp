import idx from 'idx'
import mitt from 'mitt'
import isPlainObject from 'lodash.isplainobject'
import resolvePaths from '../utilities/resolve-paths'
import fetcher from './fetcher'

mitt()

let query = null
let origin = null
let preview = false
let fetchRequests = []

const fetchJSON = (endpoint) => {
  // set default JSON source
  let url = `${origin}/api/v1/${endpoint}`
  // detect if preview source required
  if (preview) {
    const queryPrefix = endpoint.indexOf('?') > -1 ? '&' : '?'
    const queryParams = `tapestry_hash=${query.tapestry_hash}&p=${query.p}`
    url = `${origin}/api/preview/v1/${endpoint}${queryPrefix}${queryParams}`
  }
  // return fetch as promise
  return fetcher(url)
    .then(resp => resp.json())
}
const emitEvent = (event, data) => {
  if (typeof window !== 'undefined') {
    window.tapestryEmitter.emit(event, data)
  }
}
const mapArrayToObject = (arr, obj) => {
  const keys = Object.keys(obj)
  return arr.reduce((prev, curr, i) => {
    prev[keys[i]] = arr[i]
    return prev
  }, {})
}

// handle promise resolution
const handleResolve = (endpoint, resp, cb) => {
  // if this request is not the latest (i.e. the last item in the array) ignore
  if (fetchRequests[fetchRequests.length - 1] !== endpoint) {
    return
  }
  // otherwise treat it as the request we need to render
  emitEvent('dataStop')
  cb(null, { data: resp })
  // reset queued requests
  fetchRequests = []
}
const handleReject = (err, cb) => {
  emitEvent('dataStop')
  cb(err)
}

export default ({
  loadFrom,
  loadContext,
  params,
  cb
}) => {
  // save data for use in util functions
  query = idx(loadContext, _ => _.location.query)
  origin = loadContext.serverUri || window.location.origin
  preview = idx(loadContext, _ => _.location.query.tapestry_hash)
  // kick off progress loader
  if (fetchRequests.length > 1) {
    // dataReset required to reset loader before starting again
    emitEvent('dataReset')
  } else {
    emitEvent('dataStart')
  }
  // fetch each endpoint
  const endpoint = resolvePaths({
    paths: loadFrom,
    params,
    cb: fetchJSON
  })
  // handle endpoint configurations
  // can be one of Array, Object, String
  if (Array.isArray(endpoint.paths)) {
    // save reference of API request
    fetchRequests.push(endpoint.result)
    // wait for all to resolve then handle response
    return Promise
      .all(endpoint.result)
      .then(resp => handleResolve(endpoint.result, resp, cb))
      .catch(err => handleReject(err, cb))
  } else if (isPlainObject(endpoint.paths)) {
    // save reference of API request
    fetchRequests.push(endpoint.result)
    // wait for all to resolve then update response to original object schema (Promise.all() will return an ordered array so we can map back onto the object correctly)
    return Promise
      .all(endpoint.result)
      .then(resp => mapArrayToObject(resp, endpoint.paths))
      .then(resp => handleResolve(endpoint.result, resp, cb))
      .catch(err => handleReject(err, cb))
  } else {
    // save reference of API request
    fetchRequests.push(endpoint.paths)
    // handle response
    return endpoint.result
      .then(resp => handleResolve(endpoint.paths, resp, cb))
      .catch(err => handleReject(err, cb))
  }
}
