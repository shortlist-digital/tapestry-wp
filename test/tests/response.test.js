import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'
import dataPosts from '../mocks/posts.json'


describe('Handing server responses', () => {

  let tapestry = null
  let uri = null
  let config = {
    components: {
      FrontPage: () => <p>Hello</p>
    },
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .times(5)
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/pages?slug=page&_embed')
      .reply(404, { data: { status: 404 } })
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Route matched, status code is 200', (done) => {
    request.get(uri, (err, res) => {
      expect(res.statusCode).to.equal(200)
      done()
    })
  })

  it('Route matched, has correct headers', (done) => {
    request.get(uri, (err, res) => {
      expect(res.headers['content-type']).to.equal('text/html; charset=utf-8')
      done()
    })
  })

  it('Route not matched, status code is 404', (done) => {
    request
      .get(`${uri}/route/not/matched/in/any/way`, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })

  it('Route matched but API 404, status code is 404', (done) => {
    request
      .get(`${uri}/about/page`, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
})
