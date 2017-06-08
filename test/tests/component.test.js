import React from 'react'
import Helmet from 'react-helmet'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'
import dataPost from '../mocks/post.json'
import dataPosts from '../mocks/posts.json'
import dataPage from '../mocks/page.json'


describe('Custom components rendering', () => {

  let tapestry = null
  let uri = null
  let config = {
    components: {
      Post: () => (
        <Helmet>
          <title>Custom title</title>
        </Helmet>
      ),
      FrontPage: () => <p>Hello</p>
    },
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/posts?slug=slug&_embed')
      .reply(200, dataPage)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Custom components are rendered', (done) => {
    request.get(uri, (err, res, body) => {
      expect(body).to.contain('Hello')
      done()
    })
  })

  it('Custom head tags are rendered', (done) => {
    request.get(`${uri}/year/month/day/slug`, (err, res, body) => {
      expect(body).to.contain('Custom title')
      done()
    })
  })
})


describe('Default view rendering', () => {

  let tapestry = null
  let uri = null
  let config = {
    components: {
      Category: () => <p>Category component</p>,
      Post: () => <p>Post component</p>,
      Page: () => <p>Page component</p>,
      FrontPage: () => <p>FrontPage component</p>
    },
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/pages?slug=slug&_embed')
      .reply(200, dataPage)
      .get('/wp-json/wp/v2/posts?filter[category_name]=test&_embed')
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/posts?slug=slug&_embed')
      .reply(200, dataPost)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Default FrontPage is rendered', (done) => {
    request(uri, (err, res, body) => {
      expect(body).to.contain('FrontPage component')
      done()
    })
  })

  it('Default Category is rendered', (done) => {
    request(`${uri}/category/test`, (err, res, body) => {
      expect(body).to.contain('Category component')
      done()
    })
  })

  it('Default Page is rendered', (done) => {
    request(`${uri}/slug`, (err, res, body) => {
      expect(body).to.contain('Page component')
      done()
    })
  })

  it('Default Post is rendered', (done) => {
    request(`${uri}/year/month/day/slug`, (err, res, body) => {
      expect(body).to.contain('Post component')
      done()
    })
  })
})


describe('Error view rendering', () => {

  let tapestry = null
  let config = {
    components: {},
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .times(5)
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/posts?slug=slug&_embed')
      .reply(200, dataPage)
    done()
  })

  afterEach(() => tapestry.server.stop())

  it('CustomError missing in DEV, render Missing View', (done) => {
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      request
        .get(tapestry.server.info.uri, (err, res, body) => {
          expect(body).to.contain('Missing Component')
          done()
        })
    })
  })

  it('CustomError declared in DEV, render Missing View', (done) => {
    tapestry = bootServer({
      ...config,
      components: {
        CustomError: () => <p>Custom Error</p>
      }
    })
    tapestry.server.on('start', () => {
      request
        .get(`${tapestry.server.info.uri}/route/not/matched/in/any/way`, (err, res, body) => {
          expect(body).to.contain('Missing Component')
          done()
        })
    })
  })

  it('CustomError missing in PROD, render Default Error', (done) => {
    tapestry = bootServer(config, { __DEV__: false })
    tapestry.server.on('start', () => {
      request
        .get(tapestry.server.info.uri, (err, res, body) => {
          expect(body).to.contain('Application Error')
          done()
        })
    })
  })

  it('CustomError declared in PROD, render CustomError', (done) => {
    tapestry = bootServer({
      ...config,
      components: {
        CustomError: () => <p>Custom Error</p>
      }
    }, { __DEV__: false })
    tapestry.server.on('start', () => {
      request
        .get(`${tapestry.server.info.uri}/route/not/matched/in/any/way`, (err, res, body) => {
          expect(body).to.contain('Custom Error')
          done()
        })
    })
  })
})
