import React, { Component, PropTypes } from 'react'
import AsyncProps from 'async-props'
import fetch from 'isomorphic-fetch'

export default class Loader extends Component {

  static loadProps({params, loadContext}, cb) {
    // LoadContext is basicaly an object we can pass around
    // the sever with our components and some baseUrl on it
    return fetch(`${loadContext.siteUrl}/wp-json/wp/v2/pages?filter[name]=${params.slug}`)
      .then(response => response.json())
      .then(data => cb(null, { data: data[0] }))
      .catch(error => cb(error))
  }

  render () {
    const Page = this.props.route.page
    return <Page {...this.props.data} />
  }
}

Loader.propTypes = {
  route: PropTypes.shape({
    page: PropTypes.func.isRequired
  }).isRequired,
  data: PropTypes.object
}
