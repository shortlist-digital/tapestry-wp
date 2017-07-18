/* eslint-disable */
// This file is full of hacks
// Hot reload won't work with Root as a pure function for example

import React, { Component } from 'react'
import { Router } from 'react-router'

// Patch a load of rubbish React Router errors
if (module.hot) {
  Router.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Next props:', nextProps)
    let components = []
    function grabComponents(element) {
      // This only works for JSX routes, adjust accordingly for plain JS config
      if (element.props & element.props.component) {
        components.push(element.props.component)
      }
      if (element.props && element.props.children) {
        React.Children.forEach(element.props.children, grabComponents)
      }
    }
    grabComponents(nextProps.routes || nextProps.children)
    components.forEach(React.createElement) // force patching
  }
}

class Root extends Component {
  render() {
    return (
      <Router
        render={this.props.renderAsyncProps}
        routes={this.props.routes}
        {...this.props.renderProps}
      />
    )
  }
}

export default Root
