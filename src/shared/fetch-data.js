import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AsyncProps from 'async-props'
import has from 'lodash/has'
import isArray from 'lodash/isArray'
import isEmpty from 'lodash/isEmpty'
import { generate as uid } from 'shortid'
import fetchRouteData from './fetch-route-data'
import RenderError from './render-error'

const fetchData = (TopLevelComponent, route) => {

  class AsyncPropsWrapper extends Component {

    static loadProps({ params, loadContext }, cb) {
      let loadFrom = this.endpoint
      // get endpoint, either as a string or function
      if (typeof this.endpoint === 'function') {
        loadFrom = this.endpoint(params)
      }
      // go get all that data
      return fetchRouteData({ loadFrom, loadContext, cb })
    }

    componentWillReceiveProps() {
      this.forceUpdate()
    }

    render() {
      const response = this.props.data
      const arrayResponse = isArray(response)
      // to avoid React mangling the array to {'0':{},'1':{}}
      // pass through as 'posts'.
      // TODO - update posts key to something more generic
      const data = arrayResponse ?
        { posts: response } :
        response
      // should fail if an empty response?
      // TODO - BLEAURGH, improve this.
      const failOnEmpty = (
        !arrayResponse ||
        (
          arrayResponse &&
          (
            has(route, 'options.failOnEmpty') &&
            route.options.failOnEmpty
          )
        )
      )
      // check data/component exists and isn't a server errored response
      if (
        !TopLevelComponent ||
        !response ||
        (isEmpty(response) && failOnEmpty) ||
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
  AsyncPropsWrapper.endpoint = route.endpoint
  AsyncPropsWrapper.options = route.options

  AsyncPropsWrapper.propTypes = {
    data: PropTypes.any,
    route: PropTypes.any
  }

  return AsyncPropsWrapper
}

export default fetchData
