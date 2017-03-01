import React, { Component, PropTypes } from 'react'
import AsyncProps from 'async-props'
import fetch from 'isomorphic-fetch'
import { has } from 'lodash'
import MissingView from './missing-view'


export default class Loader extends Component {

  static loadProps({ params, loadContext }, cb) {

    const customLoader = loadContext.loaders && loadContext.loaders.Post
    if (customLoader) return customLoader(loadContext, cb)

    const baseUrl = `${loadContext.serverUri || window.location.origin}`
    const path = `api/v1/posts/${params.id}?_embed`

    // LoadContext is basicaly an object we can pass around
    // the sever with our components and some baseUrl on it
    return fetch(`${baseUrl}/${path}`)
      .then(resp => resp.json())
      .then(resp => {
        const data = ('0' in resp) || resp instanceof Array ?
          resp[0] :
          resp
        return cb(null, { data })
      })
      .catch(error => cb(error))
  }

  render () {

    if (typeof window !== 'undefined') { window.scrollTo(0, 0) }

    const Tag = this.props.route.tag
    const Error = this.props.route.fallback

    if (has(!this.props.data || this.props, 'data.data.status'))
      return <Error />

    if (Tag)
      return <Tag {...this.props.data} />

    return <MissingView {...this.props.data} />
  }
}

Loader.propTypes = {
  route: PropTypes.shape({
    tag: PropTypes.func,
    fallback: PropTypes.func
  }).isRequired,
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ])
}
