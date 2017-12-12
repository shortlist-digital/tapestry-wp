import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'
import { css } from 'glamor'

import { bootServer } from '../utils'
import dataPosts from '../mocks/posts.json'


describe('Document contents', () => {

  let tapestry = null
  let uri = null
  let config = {
    routes: [{
      path: '/',
      endpoint: 'posts',
      component: () => <p className={css({ color: '#639' })}>Hello</p>
    }, {
      path: 'custom-document',
      endpoint: 'posts',
      component: () => <p>Custom HTML</p>,
      options: {
        document: () => `testing-document`
      }
    }],
    siteUrl: 'http://dummy.api'
  }

  beforeEach(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts')
      .times(5)
      .reply(200, dataPosts.data)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  afterEach(() => tapestry.server.stop())

  it('Contains correct AsyncProps data', (done) => {
    request.get(uri, (err, res, body) => {
      expect(body).to.contain(`window.__ASYNC_PROPS__ = [{"data":${
        JSON.stringify(dataPosts.data)
          .replace(/\//g, '\\/')
          .replace(/\u2028/g, "\\u2028")
          .replace(/\u2029/g, "\\u2029")
      }}]`)
      done()
    })
  })

  it('Contains Glamor styles', (done) => {
    request.get(uri, (err, res, body) => {
      expect(body).to.contain('{color:#639;}')
      done()
    })
  })

  it('Uses custom document if available', (done) => {
    request.get(`${uri}/custom-document`, (err, res, body) => {
      expect(body).to.contain('testing-document')
      done()
    })
  })
})
