import React from 'react'
import Tapestry from '../app-server'
import Page from './components/Page'
import Post from './components/Post'

let postTypeMap = {
  'post': Post,
  'page' : Page
}

let App = ({post}) => {
  let Child = postTypeMap[post.type]
  return <Child post={post} />
}


let server = new Tapestry(
  App,
  'http://shortliststudio.foundry.press/wp-json'
)
