import React, { Component } from 'react'
import AsyncProps from 'async-props'

export default  function(TopLevelComponent ) {
  const name = TopLevelComponent.constructor.name
  class extends Component {
    static loadProps({ params, loadContext }, cb) {
      // Don't need any IDs or anything we just use the name of the component `Post, Category, FrontPage` etc
      return fetchRouteData(name, { params, loadContext, cb })
    }

    render() {
      return <TopLevelComponent {...this.props} />
    }
  }

  Component.displayName = `Loader: ${name}`

  return Component
}
