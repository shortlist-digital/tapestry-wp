import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AsyncProps from 'async-props'
import has from 'lodash/has'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import { generate as uid } from 'shortid'
import fetchRouteData from './fetch-route-data'
import RenderError from './render-error'

const fetchData = (TopLevelComponent, endpoint) => {

  class AsyncPropsWrapper extends Component {

    static loadProps({ params, loadContext }, cb) {
      let loadFrom = this.endpoint
      // get endpoint, either as a string or function
      if (typeof this.endpoint === 'function') {
        loadFrom = endpoint(params)
      }
      // go get all that data
      return fetchRouteData({ loadFrom, loadContext, cb })
    }

    componentWillReceiveProps() {
      this.forceUpdate()
    }
    componentDidMount() {
      // check if rendering in client
      if (typeof window !== 'undefined') {
        // reset scroll position
        window.scrollTo(0, 0)
        // run project callback
        // wrapped in setTimeout to clear call stack (blocks progress indicator)
        if (typeof this.props.route.config.onPageUpdate === 'function')
          setTimeout(this.props.route.config.onPageUpdate, 0)
      }
    }

    render() {
      // to avoid React mangling the array to {'0':{},'1':{}}
      // pass through as 'posts'
      const response = this.props.data
      const arrayResponse = isArray(response)
      const data = arrayResponse ?
        { posts: response } :
        response
      // check data/component exists and isn't a server errored response
      if (
        !TopLevelComponent ||
        !response ||
        (!arrayResponse && isEmpty(response)) ||
        has(response, 'data.status')
      )  {
        return (
          <RenderError
            data={response}
            config={this.props.route.config}
          />
        )
      }
      // otherwise return the actual component
      return (
        <TopLevelComponent
          key={uid()}
          {...data}
        />
      )
    }
  }

  AsyncPropsWrapper.displayName = `wrappedForDataFetching(${TopLevelComponent ? TopLevelComponent.name : 'Error'})`
  AsyncPropsWrapper.endpoint = endpoint

  AsyncPropsWrapper.propTypes = {
    data: PropTypes.any,
    route: PropTypes.any
  }

  return AsyncPropsWrapper
}

export default fetchData
