import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'
import { css } from 'glamor'

import { bootServer } from '../utils'
import dataPosts from '../mocks/posts.json'


describe('Not sure what these tests should be defined as', () => {

  let tapestry = null
  let uri = null
  let config = {
    components: {
      FrontPage: () =>
        <p className={css({ color: '#639' })}>Hello</p>
    },
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .times(5)
      .reply(200, dataPosts.data)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('AsyncProps defined correctly', (done) => {
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

  it('Glamor CSS works', (done) => {
    request.get(uri, (err, res, body) => {
      expect(body).to.contain('#639')
      done()
    })
  })
})
