import React from 'react'


let emojis = ['👌','🙏','👀']

let Post = ({post}) =>
  <div style={{maxWidth:700, margin: 'auto'}}>
    <link rel="stylesheet" href="http://yegor256.github.io/tacit/tacit.min.css"/>
    <h1>Tapestry Press</h1>
    <h2>{post.title.rendered}</h2>
    <img
      style={{maxWidth:'100%', width: '100%'}}
      src={post._embedded['wp:featuredmedia'][0].source_url}
    />
    <h3>
      {emojis.map((emoji,index) => {
        return <span key={index}>{emoji} </span>
      })}
    </h3>
    {post.acf.widgets.map((widget) => {
      if (widget.acf_fc_layout === 'image') {
        return (
          <div>
            <img
              src={widget.image.url}
              style={{maxWidth:'100%', width: '100%'}}
            />
            <small dangerouslySetInnerHTML={{__html:widget.caption}}></small>
          </div>
        )
      }
      if (widget.acf_fc_layout === 'heading') {
        return (
          <h2 dangerouslySetInnerHTML={{__html:widget.text}}></h2>
        )
      }
      if (widget.acf_fc_layout === 'paragraph') {
        return (
          <p dangerouslySetInnerHTML={{__html:widget.paragraph}}></p>
        )
      }
    })}
    <em>By {post._embedded.author[0].name}</em>
    <div dangerouslySetInnerHTML={{__html: post.content.rendered}}>
    </div>
    <hr/>
  </div>

export default Post
