import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AsyncProps from 'async-props'
import idx from 'idx'
import { generate as uid } from 'shortid'
import fetchRouteData from './fetch-route-data'
import RenderError from './render-error'
import handleApiResponse from './handle-api-response'

const fetchData = (TopLevelComponent, route) => {

  class AsyncPropsWrapper extends Component {

    static loadProps({ params, loadContext }, cb) {
      let loadFrom = this.endpoint
      // go get all that data
      return fetchRouteData({ loadFrom, loadContext, params, cb })
    }

    shouldComponentUpdate(nextProps) {
      return this.props.data !== nextProps.data
    }

    componentDidUpdate() {
      this.handleViewUpdate()
    }

    componentDidMount() {
      this.handleViewUpdate()
    }

    handleViewUpdate() {
      const { onPageUpdate } = this.props.route.config
      // reset scroll position
      window.scrollTo(0, 0)
      // wrapped in setTimeout to clear call stack (blocks progress indicator)
      if (typeof onPageUpdate === 'function') {
        // return response data if available
        const response = handleApiResponse(this.props.data, this.props.route)
        setTimeout(() => onPageUpdate(response), 0)
      }
    }

    render() {
      const response = handleApiResponse(this.props.data, this.props.route)

      // check data/component exists and isn't a server errored response
      if (!TopLevelComponent || idx(response, _ => _.code)) {
        return (
          <RenderError
            response={response}
            missing={!TopLevelComponent}
            config={this.props.route.config}
          />
        )
      }
      // otherwise return the actual component
      return (
        <TopLevelComponent
          key={uid()}
          {...response}
        />
      )
    }
  }

  AsyncPropsWrapper.displayName = `wrappedForDataFetching(${TopLevelComponent ? TopLevelComponent.name : 'Error'})`
  AsyncPropsWrapper.endpoint = route.endpoint
  AsyncPropsWrapper.options = route.options

  AsyncPropsWrapper.propTypes = {
    data: PropTypes.any,
    route: PropTypes.any
  }

  return AsyncPropsWrapper
}

export default fetchData
