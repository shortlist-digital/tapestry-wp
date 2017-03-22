import fetch from 'isomorphic-fetch'

export default ({ endpoint, loadContext, cb }) => {
  // create API path
  const baseUrl = `${loadContext.serverUri || window.location.origin}/api/v1`
  // go and fetch data from constructed API path
  // run callback from AsyncProps
  return fetch(`${baseUrl}/${endpoint}`)
    .then(resp => {
      // catch server error
      if (!resp.ok) throw new Error(resp)
      return resp
    })
    .then(resp => resp.json())
    .then(resp => cb(null, { data: resp }))
    .catch(error => cb(error))
}
