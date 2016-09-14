import React, { Component } from 'react'
import AsyncProps from 'async-props'
import fetch from 'isomorphic-fetch'
import Post from '../example-app/components/post'

class PostLoader extends Component {

  static loadProps({params, loadContext}, cb) {
    console.log('Post loader', params, loadContext)
    let url = `https://crossorigin.me/${loadContext.siteUrl}/wp-json/wp/v2/posts/${params.id}?_embed`
    // LoadContext is basicaly an object we can pass around
    // the sever with our components and some baseUrl on it
    return fetch(url)
      .then(response => {
        return response.json()
      }).then(data => {
        cb(null, {post: data})
      }).catch(error => {
        return cb(error)
      })
  }

  render() {
    return (
      <Post post={this.props.post} />
    )
  }
}

export default PostLoader
