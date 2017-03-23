import axios from 'axios'

export default ({ endpoint, loadContext, cb }) => {
  // create API path
  const baseUrl = `${loadContext.serverUri || window.location.origin}/api/v1`
  // go and fetch data from constructed API path
  // run callback from AsyncProps
  return axios.get(`${baseUrl}/${endpoint}`, {
    onDownloadProgress: (event) => console.log(event) // eslint-disable-line no-console
  })
    .then(resp => {
      // catch server error
      if (resp.statusText !== 'OK') throw new Error(resp)
      return resp.data
    })
    .then(resp => {
      cb(null, { data: resp })
    })
    .catch(error => cb(error))
}
