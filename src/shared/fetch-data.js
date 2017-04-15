import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AsyncProps from 'async-props'
import has from 'lodash/has'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import { generate as uid } from 'shortid'
import fetchRouteData from './fetch-route-data'
import MissingView from './missing-view'
import DefaultError from './default-error'

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

    render() {
      // get error view to render if required
      const config = this.props.route.config
      let ErrorView = has(config, 'components.CustomError') ?
        config.components.CustomError :
        DefaultError
      // to avoid React mangling the array to {'0':{},'1':{}}
      // pass through as 'posts'
      const response = this.props.data
      const data = isArray(response) ?
        { posts: response } :
        response
      console.log({ response })
      // check data exists and isn't a server errored response
      if (!TopLevelComponent || !response || isEmpty(response) || has(response, 'data.status'))  {
        return (
          __DEV__ ?
            <MissingView {...response} /> :
            <ErrorView
              status="404"
              message="Page not found"
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
