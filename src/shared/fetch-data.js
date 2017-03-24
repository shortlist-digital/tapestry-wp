import React, { Component, PropTypes } from 'react'
import AsyncProps from 'async-props'
import has from 'lodash/has'
import toArray from 'lodash/toArray'
import isEmpty from 'lodash/isEmpty'
import fetchRouteData from './fetch-route-data'
import MissingView from './missing-view'
import shortid from 'shortid'

const fetchData = (TopLevelComponent, endpoint) => {

  class AsyncPropsWrapper extends Component {

    static loadProps({ params, loadContext }, cb) {
      let loadFrom = this.endpoint
      // get endpoint, either as a string or function
      if (typeof this.endpoint === 'function') {
        loadFrom = endpoint = endpoint(params)
      }
      // go get all that data
      return fetchRouteData({ loadFrom, loadContext, cb })
    }

    render() {
      // check data exists and isnt a server errored response
      if (!this.props.data || isEmpty(this.props.data) || has(this.props.data, 'data.status'))  {
        return <MissingView />
      }
      const resp = this.props.data
      let data = ('0' in resp) || resp instanceof Array ? { posts: toArray(resp) } : resp
      if (data.posts && data.posts.length == 1)  {
        data = data.posts[0]
      }
      // otherwise return the actual component
      return <TopLevelComponent key={shortid.generate()} {...data} />
    }
  }

  AsyncPropsWrapper.displayName =`wrappedForDataFetching(${TopLevelComponent.name})`

  AsyncPropsWrapper.endpoint = endpoint

  AsyncPropsWrapper.propTypes = {
    data: PropTypes.any
  }

  return AsyncPropsWrapper
}

export default fetchData
