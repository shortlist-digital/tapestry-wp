import idx from 'idx'
import HTTPStatus from 'http-status'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'

export default (response, route) => {
  // WP returns single objects or arrays
  const arrayResp = isArray(response)
  // 1: does it contain a status code? then it'll be an error response from WP
  // 2: is it an empty array and allowEmptyResponse is not true
  if (
    !response ||
    idx(response, _ => _.data.status) ||
    (
      arrayResp &&
      isEmpty(response) &&
      !idx(route, _ => _.component.options.allowEmptyResponse)
    )
  ) {
    const status = idx(response, _ => _.data.status) || HTTPStatus.NOT_FOUND
    return {
      code: status,
      message: HTTPStatus[status]
    }
  }
  // to avoid React mangling the array to {'0':{},'1':{}}
  // wrap in an object
  return arrayResp ? { data: response } : response
}
