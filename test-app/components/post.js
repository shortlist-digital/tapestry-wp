import React from 'react'
import Paragraph from './paragraph'
import Image from './image'
import Heading from './heading'

let getWidget = (name) => {
  let widgetMap = {
    'paragraph': Paragraph,
    'image': Image,
    'heading': Heading
  }
  return widgetMap[name] || null
}

let Post = ({post}) =>
  <div>
    <h1>Tapestry Press</h1>
    <h2>{post.title.rendered}</h2>
    <h4><em>By {post._embedded.author[0].name}</em></h4>
    <Image
      image={{
        url: post._embedded['wp:featuredmedia'][0].source_url
      }}
    />
    {post.acf.widgets.map((widget, index) => {
      let Widget = getWidget(widget.acf_fc_layout)
      return Widget ? <Widget key={index} {...widget} /> : null
    })}
    <hr/>
  </div>

export default Post
