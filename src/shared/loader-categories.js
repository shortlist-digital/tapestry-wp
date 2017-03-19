import { Component, PropTypes } from 'react'
import AsyncProps from 'async-props'
import fetchRouteData from './fetch-route-data'
import renderRoute from './render-route'


export default class Loader extends Component {

  static loadProps({ params, loadContext }, cb) {
    return fetchRouteData('Category', { params, loadContext, cb })
  }

  render () {
    return renderRoute(this.props.route, this.props.data)
  }
}

Loader.propTypes = {
  route: PropTypes.shape({
    config: PropTypes.object,
    id: PropTypes.string
  }).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
}
