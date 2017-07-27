import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import CacheManager from '../../src/utilities/cache-manager'
import { bootServer } from '../utils'
import dataPost from '../mocks/post.json'
import dataPosts from '../mocks/posts.json'
import dataPage from '../mocks/page.json'
import dataPages from '../mocks/pages.json'

describe('Handling cache purges', () => {

  let tapestry = null
  let uri = null
  let config = {
    routes: [{
      path: '/',
      endpoint: 'pages',
      component: () => <p>Basic endpoint</p>
    }, {
      path: 'string-endpoint',
      endpoint: 'pages',
      component: () => <p>Basic endpoint</p>
    }, {
      path: 'dynamic-string-endpoint/:custom',
      endpoint: (params) => `pages?slug=${params.custom}`,
      component: () => <p>Custom endpoint</p>
    }],
    siteUrl: 'http://dummy.api'
  }
  const cacheManager = new CacheManager()

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/pages')
      .times(2)
      .reply(200, dataPages.data)
      .get('/wp-json/wp/v2/pages?slug=test')
      .reply(200, dataPage)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('String endpoint is purgeable', (done) => {
    const route = 'string-endpoint'
    const purgeResp = { status: `Purged ${route}` }

    request.get(`${uri}/${route}`, (err, res, body) => {
      expect(body).to.contain('Basic endpoint')
      expect(res.statusCode).to.equal(200)

      request.get(`${uri}/purge/${route}`, (err, res, body) => {
        const cacheApi = cacheManager.getCache('api')
        expect(body).to.contain(JSON.stringify(purgeResp))
        expect(res.statusCode).to.equal(200)
        expect(cacheApi.keys()).to.not.contain('pages')

        done()
      })
    })
  })

  it('Dynamic string endpoint is purgeable', (done) => {
    const route = `dynamic-string-endpoint/test`
    const purgeResp = { status: `Purged ${route}` }

    request.get(`${uri}/${route}`, (err, res, body) => {
      expect(body).to.contain('Custom endpoint')
      expect(res.statusCode).to.equal(200)

      request.get(`${uri}/purge/${route}`, (err, res, body) => {
        const cacheApi = cacheManager.getCache('api')
        expect(body).to.contain(JSON.stringify(purgeResp))
        expect(res.statusCode).to.equal(200)
        expect(cacheApi.keys()).to.not.contain('pages?slug=test')

        done()
      })
    })
  })

  it('Home route is purgeable', (done) => {
    const route = '/'
    const purgeResp = { status: `Purged ${route}` }

    request.get(`${uri}`, (err, res, body) => {
      expect(body).to.contain('Basic endpoint')
      expect(res.statusCode).to.equal(200)

      request.get(`${uri}/purge/${route}`, (err, res, body) => {
        const cacheApi = cacheManager.getCache('api')
        expect(body).to.contain(JSON.stringify(purgeResp))
        expect(res.statusCode).to.equal(200)
        expect(cacheApi.keys()).to.not.contain('pages')

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
