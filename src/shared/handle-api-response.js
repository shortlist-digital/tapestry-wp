import idx from 'idx'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'

export default (response, route) => {
  // cancel early if no response data
  if (!response) return null
  // WP returns single objects or arrays
  const arrayResp = isArray(response)
  // 1: does it contain a status code? then it'll be an error response from WP
  // 2: is it an empty array and allowEmptyResponse is not true
  if (
    idx(response, _ => _.data.status) ||
    (
      arrayResp &&
      isEmpty(response) &&
      !idx(route, _ => _.component.options.allowEmptyResponse)
    )
  ) {
    // TODO - return better error response
    return null
  }
  // to avoid React mangling the array to {'0':{},'1':{}}
  // wrap in an object
  return arrayResp ? { data: response } : response
}
