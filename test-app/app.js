import React from 'react'
import Tapestry from '../app-server'
import Page from './components/Page'
import Post from './components/Post'
import Helmet from 'react-helmet'

let postTypeMap = {
  'post': Post,
  'page' : Page
}

let App = ({post}) => {
  let siteName = 'Shortlist Studio'
  let Child = postTypeMap[post.type]
  return (
    <div>
      <Helmet
        title={siteName}
        titleTemplate={`%s | ${siteName}`}
        meta={[
          {property: 'og:title', content: siteName},
        ]}
        link={[
          {
            'rel': 'stylesheet',
            'href': 'http://yegor256.github.io/tacit/tacit.min.css'
          }
        ]}
      />
      <Child post={post} />
    </div>
  )
}


let server = new Tapestry(
  App,
  'http://shortliststudio.foundry.press/wp-json'
)

server.start()
