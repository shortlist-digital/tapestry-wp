import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'
import dataPage from '../mocks/page.json'


describe('Handling redirects', () => {

  let tapestry = null
  let uri = null
  let config = {
    redirectPaths: {
      '/redirect/from/this-path': '/page',
      '/redirect/with/query': '/page'
    },
    siteUrl: 'http://dummy.api',
    components: {
      Page: () => <p>Redirected component</p>
    }
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/pages?slug=page&_embed')
      .times(2)
      .reply(200, dataPage)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Redirect returns 308 status', (done) => {
    tapestry.server.inject(`${uri}/redirect/from/this-path`, (res) => {
      expect(res.statusCode).to.equal(308)
      done()
    })
  })

  it('Redirect path redirects correctly', (done) => {
    request.get(`${uri}/redirect/from/this-path`, (err, res, body) => {
      expect(body).to.contain('Redirected component')
      expect(res.statusCode).to.equal(200)
      done()
    })
  })

  it('Redirect path contains querystring', (done) => {
    const query = '?querystring=something'
    request.get(`${uri}/redirect/with/query${query}`, (err, res, body) => {
      expect(res.req.path).to.contain(`/page${query}`)
      done()
    })
  })
})
