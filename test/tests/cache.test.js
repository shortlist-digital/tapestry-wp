import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import CacheManager from '../../src/utilities/cache-manager'
import { bootServer } from '../utils'
import dataPost from '../mocks/post.json'
import dataPosts from '../mocks/posts.json'


describe('Handling cache purges', () => {

  let tapestry = null
  let uri = null
  let config = {
    components: {
      FrontPage: () => <p>Hello</p>,
      Post: () => <p>Hello</p>
    },
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/posts?slug=test&_embed')
      .reply(200, dataPost)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Homepage is purgeable', (done) => {
    request.get(uri, (err, res, body) => {
      expect(body).to.contain('Hello')
      expect(res.statusCode).to.equal(200)
      request
        .get(`${uri}/purge//`, (err, res, body) => {
          const purgeResponse = JSON.stringify({ status: 'Purged /' })
          expect(body).to.contain(purgeResponse)
          expect(res.statusCode).to.equal(200)
          done()
        })
    })
  })

  it('Post is purgeable', (done) => {
    const postRoute = '2017/12/01/test'
    request.get(`${uri}/${postRoute}`, (err, res, body) => {
      expect(body).to.contain('Hello')
      expect(res.statusCode).to.equal(200)
      request
        .get(`${uri}/purge/${postRoute}`, (err, res, body) => {
          const purgeResponse = JSON.stringify({ status: `Purged ${postRoute}` })
          expect(body).to.contain(purgeResponse)
          expect(res.statusCode).to.equal(200)
          done()
        })
    })
  })
})

describe('Handling cache set/get', () => {

  let tapestry = null
  let uri = null
  let config = {
    components: {
      FrontPage: () => <p>Hello</p>,
      Post: () => <p>Hello</p>
    },
    siteUrl: 'http://dummy.api'
  }
  const cacheManager = new CacheManager()

  before(done => {
    // sorry for this
    process.env.NODE_ENV = 'production'
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .times(2)
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/posts?slug=test&_embed')
      .reply(200, dataPost)
    // boot tapestry server
    tapestry = bootServer(config, { __DEV__: false })
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => {
    // sorry for this
    process.env.NODE_ENV = ''
    tapestry.server.stop()
  })

  it('Sets API/HTML cache items correctly', done => {
    request.get(uri, (err, res, body) => {
      const cacheApi = cacheManager.getCache('api')
      const cacheHtml = cacheManager.getCache('html')
      expect(cacheApi.keys()).to.include('posts?_embed')
      expect(cacheHtml.keys()).to.include('/')
      done()
    })
  })

  it('Retrieves API cache items correctly', done => {
    const cacheApi = cacheManager.getCache('api')
    const postRoute = '2017/12/01/test'
    const response = { cache: 'response' }
    cacheApi.set('posts?slug=test&_embed', { response: response })
    request.get(`${uri}/${postRoute}`, (err, res, body) => {
      expect(body).to.contain(JSON.stringify(response))
      done()
    })
  })

  it('Retrieves HTML cache items correctly', done => {
    const cacheHtml = cacheManager.getCache('html')
    const response = 'test string'
    cacheHtml.set('/', response)
    request.get(uri, (err, res, body) => {
      expect(body).to.equal(response)
      done()
    })
  })
})
