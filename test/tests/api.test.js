import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'
import dataPosts from '../mocks/posts.json'

describe('Handling API responses', () => {
  let tapestry = null
  let uri = null
  let config = {
    components: {
      Post: () => <h1>Post</h1>
    },
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?slug=test&_embed')
      .reply(200, dataPosts.data)

    process.env.CACHE_CONTROL_MAX_AGE=60
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => {
    tapestry.server.stop()
    delete process.env.CACHE_CONTROL_MAX_AGE
  })


  it('Route matched, has correct headers', (done) => {
    request.get(`${uri}/api/v1/posts?slug=test&_embed`, (err, res) => {
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8')
      expect(res.headers['cache-control']).to.equal('max-age=60, must-revalidate, public')
      done()
    })
  })

})

