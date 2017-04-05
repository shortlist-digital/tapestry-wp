import fetch from 'isomorphic-fetch'
import mitt from 'mitt'
import { errorObject } from '../utilities/logger'

mitt()

export default ({ loadFrom, loadContext, cb }) => {
  const endpoint = loadFrom
  // create API path
  const baseUrl = `${loadContext.serverUri || window.location.origin}/api/v1`
  // go and fetch data from constructed API path
  // run callback from AsyncProps
  if (typeof window !== 'undefined') {
    window.tapestryEmitter.emit('dataStart', 'start')
  }
  return fetch(`${baseUrl}/${endpoint}`)
    // .then(resp => {
    //   // catch server error
    //   // if (!resp.ok) throw new Error(resp)
    //   return resp
    // })
    .then(resp => resp.json())
    .then(resp => {
      if (typeof window !== 'undefined') {
        window.tapestryEmitter.emit('dataStop', 'stop')
      }
      cb(null, { data: resp })
    })
    .catch(error => {
      if (typeof window !== 'undefined') {
        window.tapestryEmitter.emit('dataStop', 'stop')
      }
      errorObject(error)
      cb(error)
    })
}
