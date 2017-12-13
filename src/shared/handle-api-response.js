import idx from 'idx'
import HTTPStatus from 'http-status'
import isEmpty from 'lodash.isempty'

const hasFailed = ({ response, config }) => (
  // 1: is it a falsey value
  !response ||
  // 2: does it contain a status code? then it'll be an error response from WP
  idx(response, _ => _.data.status) ||
  // 3: is it an array, that is empty, and options.allowEmptyResponse is falsey
  (
    Array.isArray(response) &&
    isEmpty(response) &&
    !idx(config, _ => _[0].options.allowEmptyResponse)
  )
)

export default (response, route) => {

  const routes = idx(route, _ => _.config.routes)
  const config = routes
    ? routes.filter(item => item.path === route.path)
    : {}

  if (hasFailed({ response, config })) {
    // Assign status
    let status = idx(response, _ => _.data.status) || HTTPStatus.NOT_FOUND
    return {
      code: status,
      message: HTTPStatus[status]
    }
  }
  // to avoid React mangling the array to {'0':{},'1':{}}
  // wrap in an object
  return Array.isArray(response)
    ? { data: response }
    : response
}
