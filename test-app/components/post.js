import React from 'react'
import Helmet from 'react-helmet'
import Image from './image'
import Widgets from './widgets'

let Post = ({post}) =>
  <div>
    <Helmet title={post.title.rendered} />
    <h1>Tapestry Press</h1>
    <h2>{post.title.rendered}</h2>
    <h4><em>By {post._embedded.author[0].name}</em></h4>
    <Image
      image={{
        url: post._embedded['wp:featuredmedia'][0].source_url
      }}
    />
    <Widgets {...post.acf} />
  </div>

export default Post
