import React from 'react'
import Tapestry from '../app-server'
import Page from './components/Page'
import Post from './components/Post'
import Nav from './components/Nav'
import Helmet from 'react-helmet'

let App = (props) => {
  let siteName = 'Shortlist Studio'
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
        <Nav />
        {props.children}
    </div>
  )
}

let tapestry = new Tapestry({
    App,
    Post,
    Page
  },
  'http://shortliststudio.foundry.press'
)

tapestry.proxy('/robots.txt')
tapestry.proxy('/sitemap.xml')

tapestry.start()
