import React, { Component } from 'react'
import AsyncProps from 'async-props'
import fetch from 'isomorphic-fetch'

class PostLoader extends Component {

  static loadProps({params, loadContext}, cb) {
    let url = `${loadContext.baseUrl}/wp-json/wp/v2/posts/${params.id}?_embed`
    // LoadContext is basicaly an object we can pass around
    // the sever with our components and some baseUrl on it
    let Post = loadContext.components.Post
    return fetch(url)
      .then(response => {
        return response.json()
      }).then(data => {
        cb(null, {post: data, component: Post })
      }).catch(error => {
        return cb(error)
      })
  }

  render() {
    let Post = this.props.component
    return (
      <Post post={this.props.post} />
    )
  }
}

export default PostLoader
