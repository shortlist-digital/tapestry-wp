import React from 'react'
import Nav from './components/Nav'
import Helmet from 'react-helmet'

let Base = (props) => {
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
      <footer>
        <h2>You could do a footer here</h2>
      </footer>
    </div>
  )
}

export default Base
