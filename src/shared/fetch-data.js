import React, { Component, PropTypes } from 'react'
import AsyncProps from 'async-props'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import fetchRouteData from './fetch-route-data'
import MissingView from './missing-view'

export default function renderRoute(TopLevelComponent) {

  class DataFetcher extends Component {

    static loadProps({ params, loadContext }, cb) {
      // get endpoint, either as a string of function
      let endpoint = TopLevelComponent.endpoint
      if (typeof endpoint === 'function') {
        endpoint = TopLevelComponent.endpoint(params)
      }
      // go get all that data
      return fetchRouteData({ endpoint, loadContext, cb })
    }

    render() {
      // check data exists and isnt a server errored response
      if (!this.props.data || isEmpty(this.props.data) || has(this.props.data, 'data.status')) return <MissingView />
      // otherwise return the actual component
      return <TopLevelComponent {...this.props.data} />
    }
  }

  DataFetcher.propTypes = {
    data: PropTypes.any
  }

  return DataFetcher
}
