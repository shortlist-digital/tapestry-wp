import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import CacheManager from '../../src/utilities/cache-manager'
import { bootServer } from '../utils'
import dataPost from '../mocks/post.json'

const prepareJson = data =>
  JSON.stringify(data)
    .replace(/\//g, '\\/')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

describe('Handling preview requests', () => {
  let tapestry = null
  let uri = null
  let config = {
    routes: [
      {
        path: 'dynamic-string-endpoint/:custom',
        endpoint: params => `posts?slug=${params.custom}`,
        component: () => <p>Custom endpoint</p>
      }
    ],
    siteUrl: 'http://dummy.api'
  }

  const cacheManager = new CacheManager()

  before(done => {
    process.env.CACHE_MAX_AGE = 60 * 1000
    // mock api response
    nock('http://dummy.api')
      .get(
        '/wp-json/revision/v1/posts?slug=preview-test&tapestry_hash=hash&p=10'
      )
      .reply(200, dataPost)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => {
    delete process.env.CACHE_MAX_AGE
    tapestry.server.stop()
  })

  it('Preview route renders and is not cached', done => {
    const cacheApi = cacheManager.getCache('api')
    cacheApi.reset()
    request.get(
      `${uri}/dynamic-string-endpoint/preview-test?tapestry_hash=hash&p=10`,
      async (err, res, body) => {
        const keys = await cacheApi.keys()
        expect(keys).to.be.empty
        expect(body).to.contain(prepareJson(dataPost))
        done()
      }
    )
  })
})
