import React, { Component, PropTypes } from 'react'
import AsyncProps from 'async-props'
import fetch from 'isomorphic-fetch'
import MissingView from './missing-view'

export default class Loader extends Component {

  static loadProps({params, loadContext}, cb) {

    const customLoader = loadContext.loaders && loadContext.loaders.Categories
    if (customLoader) return customLoader(loadContext.siteUrl, cb)

    const baseUrl = `${loadContext.siteUrl}/wp-json/wp/v2`
    const path = `posts?filter[category_name]=${params.subcategory || params.category}`

    // LoadContext is basicaly an object we can pass around
    // the sever with our components and some baseUrl on it
    return fetch(`${baseUrl}/${path}`)
      .then(response => response.json())
      .then(data => cb(null, { data }))
      .catch(error => cb(error))
  }

  render () {
    const Tag = this.props.route.tag
    return Tag ?
      <Tag {...this.props.data} /> :
      <MissingView {...this.props.data} />
  }
}

Loader.propTypes = {
  route: PropTypes.shape({
    tag: PropTypes.func
  }).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
}
