import React from 'react'
import Helmet from 'react-helmet'
import Image from './image'
import Widgets from './widgets'

let Post = ({post}) => {
  let emojis = ['😬😁😇😉😊😋😗😘😜🤓🙄😡😠😂']
  return (
    <div>
      <Helmet title={post.title.rendered} />
      <h3
        style={{
          fontSize: 32,
          fontWeight: 300
        }}
      >A new post: {post.title.rendered}</h3>
      {[...emojis].map((emoji, index) => {
          return <span key={index}>{emoji}</span>
      })}
      <h4><em>By {post._embedded.author[0].name}</em></h4>
      <Image
        image={{
          url: post._embedded['wp:featuredmedia'][0].source_url
        }}
      />
      <Widgets {...post.acf} />
    </div>
  )
}

export default Post
