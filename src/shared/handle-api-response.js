import idx from 'idx'
import HTTPStatus from 'http-status'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'

export default (response, route) => {
  // WP returns single objects or arrays
  const arrayResp = isArray(response)
  const routes = idx(route, _ => _.config.routes)
  let routeConfig = routes ? routes.filter(item => item.path === route.path) : null
  // 1: does it contain a status code? then it'll be an error response from WP
  // 2: is it an empty array and allowEmptyResponse is not true
  if (
    !response ||
    idx(response, _ => _.data.status) ||
    (
      arrayResp &&
      isEmpty(response) &&
      !idx(routeConfig, _ => _[0].options.allowEmptyResponse)
    )
  ) {
    // Assign status
    let status = idx(response, _ => _.data.status) || HTTPStatus.NOT_FOUND

    // Check for static routes with no endpoint
    const routeExistsWithNoEndpoint = idx(routeConfig, _ => _[0].path) &&
      !idx(routeConfig, _ => _[0].endpoint)

    // If the route is registered but has no endpoint, assume 200
    status = routeExistsWithNoEndpoint ? HTTPStatus.OK : status

    return {
      code: status,
      message: HTTPStatus[status]
    }
  }
  // to avoid React mangling the array to {'0':{},'1':{}}
  // wrap in an object
  return arrayResp ? { data: response } : response
}
