import React from 'react'
import Helmet from 'react-helmet'
import Image from './image'
import Widgets from './widgets'
import ObjectInspector from 'react-object-inspector'

const Post = ({post}) =>
  <div>
    <h1>{post.title.rendered}</h1>
    <h2>{post.acf.sell}</h2>
    <hr />
    <small style={{marginBottom: '25px', display: 'block'}}>
      By {post._embedded.author[0].name}
    </small>
    <Image
      image={{
        url: post._embedded['wp:featuredmedia'][0].source_url
      }}
    />
    <Widgets {...post.acf} />
    <ObjectInspector data={post} />
  </div>

export default Post
