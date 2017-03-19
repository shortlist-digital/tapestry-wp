import React, { Component } from 'react'
import AsyncProps from 'async-props'
import fetchRouteData from './shared/fetch-route-data'

export default  function(TopLevelComponent) {
  return class DataHOC extends Component {
    static loadProps({ params, loadContext }, cb) {
      // Don't need any IDs or anything we just use the name of the component `Post, Category, FrontPage` etc
      return fetchRouteData(TopLevelComponent.constructor.name, { params, loadContext, cb })
    }

    render() {
      return <TopLevelComponent {...this.props} />
    }
  }
}
