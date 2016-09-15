import React from 'react'


let emojis = ['👌','🙏','👀']

const Page = ({post}) =>
  <div style={{maxWidth:700, margin: 'auto'}}>
    <link rel="stylesheet" href="http://yegor256.github.io/tacit/tacit.min.css"/>
    <h1>Tapestry Press</h1>
    <h2>{post.title.rendered}</h2>
    <img
      style={{maxWidth:'100%', width: '100%'}}
      src={post._embedded['wp:featuredmedia'][0].source_url}
    />
    <h3>
      {emojis.map((emoji) => {
        return <span>{emoji} </span>
      })}
    </h3>
    <em>By {post._embedded.author[0].name}</em>
    <div dangerouslySetInnerHTML={{__html: post.content.rendered}}>
    </div>
    <hr/>
  </div>

export default Page
