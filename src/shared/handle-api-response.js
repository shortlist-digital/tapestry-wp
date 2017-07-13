import idx from 'idx'
import HTTPStatus from 'http-status'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'

export default (response, route) => {
  // WP returns single objects or arrays
  const arrayResp = isArray(response)
  const routes = idx(route, _ => _.config.routes)
  let config = routes ? routes.filter(item => item.path === route.path) : null
  // 1: does it contain a status code? then it'll be an error response from WP
  // 2: is it an empty array and allowEmptyResponse is not true
  if (
    !response ||
    idx(response, _ => _.data.status) ||
    (
      arrayResp &&
      isEmpty(response) &&
      !idx(config, _ => _[0].options.allowEmptyResponse)
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
