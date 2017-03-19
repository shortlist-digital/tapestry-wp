/* eslint-disable react/prop-types */
// I  have prop types here but eslint doesn't seem to pick it up
import React, { Component, PropTypes } from 'react'
import AsyncProps from 'async-props'
import { has } from 'lodash'
import MissingView from './shared/missing-view'
import fetchRouteData from './shared/fetch-route-data'

export default function fetchData(TopLevelComponent) {
  class FetchDataHOC extends Component {
    static loadProps({ params, loadContext }, cb) {
      // Don't need any IDs or anything we just use the name of the component `Post, Category, FrontPage` etc
      return fetchRouteData(TopLevelComponent.name, { params, loadContext, cb })
    }

    render() {
      const Error = MissingView
      // check data exists and isnt a server errored response
      // eslin
      if (!this.props.data || has(this.props.data, 'data.status'))
        return <Error />
      return <TopLevelComponent {...this.props} />
    }
  }
  FetchDataHOC.displayName = `fetchData(${TopLevelComponent.name})`
  FetchDataHOC.PropTypes = {
    data: PropTypes.object
  }
  return FetchDataHOC
}
