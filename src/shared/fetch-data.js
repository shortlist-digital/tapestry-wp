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

    render() {
      // to avoid React mangling the array to {'0':{},'1':{}}
      // pass through as 'posts'
      const response = this.props.data
      const data = isArray(response) ?
        { posts: response } :
        response
      // console.log({ response })
      // check data exists and isn't a server errored response
// <<<<<<< HEAD
      if (!response || isEmpty(response) || has(response, 'data.status'))  {
        return (
          <RenderError
            response={response}
            config={this.props.route.config}
            status="404"
          />
// =======
//       if (!TopLevelComponent || !response || isEmpty(response) || has(response, 'data.status'))  {
//         return (
//           __DEV__ ?
//             <MissingView {...response} /> :
//             <ErrorView
//               status="404"
//               message="Page not found"
//             />
// >>>>>>> improve-missing-view
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

  AsyncPropsWrapper.displayName = `wrappedForDataFetching(${TopLevelComponent.name})`
  AsyncPropsWrapper.endpoint = endpoint

  AsyncPropsWrapper.propTypes = {
    data: PropTypes.any,
    route: PropTypes.any
  }

  return AsyncPropsWrapper
}

export default fetchData
