import { Component, PropTypes } from 'react'
import AsyncProps from 'async-props'
import handleRouteData from './handle-route-data'
import handleRouteRender from './handle-route-render'


export default class Loader extends Component {

  static loadProps({ params, loadContext }, cb) {
    return handleRouteData('Post', { params, loadContext, cb })
  }

  render () {
    return handleRouteRender(this.props.route, this.props.data)
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
