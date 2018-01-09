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
    routes: [
      {
        path: '/',
        endpoint: 'pages',
        component: () => <p>Basic endpoint</p>
      },
      {
        path: 'string-endpoint',
        endpoint: 'pages',
        component: () => <p>Basic endpoint</p>
      },
      {
        path: 'dynamic-string-endpoint/:custom',
        endpoint: params => `pages?slug=${params.custom}`,
        component: () => <p>Custom endpoint</p>
      },
      {
        path: 'multiple-endpoint',
        endpoint: ['pages', 'pages?slug=test'],
        component: () => <p>Multi endpoint</p>
      }
    ],
    siteUrl: 'http://dummy.api'
  }
  const cacheManager = new CacheManager()

  beforeEach(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/pages')
      .times(4)
      .reply(200, dataPages.data)
      .get('/wp-json/wp/v2/pages?slug=test')
      .times(4)
      .reply(200, dataPage)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  afterEach(() => tapestry.server.stop())

  it('String endpoint is purgeable', done => {
    const route = 'string-endpoint'
    const purgeResp = { status: `Purged ${route}` }

    request.get(`${uri}/${route}`, (err, res, body) => {
      expect(body).to.contain('Basic endpoint')
      expect(res.statusCode).to.equal(200)

      request.get(`${uri}/purge/${route}`, async (err, res, body) => {
        const cacheApi = cacheManager.getCache('api')
        expect(body).to.contain(JSON.stringify(purgeResp))
        expect(res.statusCode).to.equal(200)
        const result = await cacheApi.get('pages')
        expect(result).to.not.exist
        done()
      })
    })
  })

  it('Dynamic string endpoint is purgeable', done => {
    const route = `dynamic-string-endpoint/test`
    const purgeResp = { status: `Purged ${route}` }

    request.get(`${uri}/${route}`, (err, res, body) => {
      expect(body).to.contain('Custom endpoint')
      expect(res.statusCode).to.equal(200)

      request.get(`${uri}/purge/${route}`, async (err, res, body) => {
        const cacheApi = cacheManager.getCache('api')
        expect(body).to.contain(JSON.stringify(purgeResp))
        expect(res.statusCode).to.equal(200)
        const result = await cacheApi.get('pages?slug=test')
        expect(result).to.not.exist
        done()
      })
    })
  })

  it('Multi array endpoint is purgeable', done => {
    const route = `multiple-endpoint`
    const purgeResp = { status: `Purged ${route}` }

    request.get(`${uri}/${route}`, (err, res, body) => {
      expect(body).to.contain('Multi endpoint')
      expect(res.statusCode).to.equal(200)

      request.get(`${uri}/purge/${route}`, async (err, res, body) => {
        const cacheApi = cacheManager.getCache('api')
        expect(body).to.contain(JSON.stringify(purgeResp))
        expect(res.statusCode).to.equal(200)
        let result = await cacheApi.get('testing')
        expect(result).to.not.exist
        result = await cacheApi.get('pages')
        expect(result).to.not.exist
        done()
      })
    })
  })

  it('Home route is purgeable', done => {
    const route = '/'
    const purgeResp = { status: `Purged ${route}` }

    request.get(`${uri}`, (err, res, body) => {
      expect(body).to.contain('Basic endpoint')
      expect(res.statusCode).to.equal(200)

      request.get(`${uri}/purge/${route}`, async (err, res, body) => {
        const cacheApi = cacheManager.getCache('api')
        expect(body).to.contain(JSON.stringify(purgeResp))
        expect(res.statusCode).to.equal(200)
        const result = await cacheApi.get('pages')
        expect(result).to.not.exist

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
    process.env.CACHE_MAX_AGE = 60 * 1000
    process.env.CACHE_MAX_ITEM_COUNT = 2
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .times(2)
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/posts?slug=test&_embed')
      .reply(200, dataPost)
      .get('/wp-json/wp/v2/posts?slug=item-one&_embed')
      .reply(200, dataPost)
      .get('/wp-json/wp/v2/posts?slug=item-two&_embed')
      .reply(200, dataPost)
      .get('/wp-json/wp/v2/posts?slug=item-three&_embed')
      .reply(200, dataPost)
      .get('/wp-json/wp/v2/posts?slug=query-test&_embed')
      .reply(200, dataPost)
    // boot tapestry server
    tapestry = bootServer(config, { __DEV__: false })
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => {
    delete process.env.CACHE_MAX_AGE
    delete process.env.CACHE_MAX_ITEM_COUNT
    tapestry.server.stop()
  })

  it('Sets API/HTML cache items correctly', done => {
    request.get(uri, async (err, res, body) => {
      const cacheApi = cacheManager.getCache('api')
      const cacheHtml = cacheManager.getCache('html')
      const apiResult = await cacheApi.get('posts?_embed')
      const htmlResult = await cacheHtml.get('/')
      expect(apiResult)
        .to.be.an('object')
        .to.have.ownProperty('response')
      expect(htmlResult)
        .to.be.a('string')
        .that.includes('doctype')
      done()
    })
  })

  it('Sets API/HTML cache items without query string', done => {
    request.get(
      `${uri}/2017/12/01/query-test?utm_source=stop-it`,
      async (err, res, body) => {
        const cacheHtml = cacheManager.getCache('html')
        const shouldCache = await cacheHtml.get('2017/12/01/query-test')
        const shouldNotCache = await cacheHtml.get(
          '2017/12/01/query-test?utm_source=stop-it'
        )
        expect(shouldCache)
          .to.be.a('string')
          .that.includes('doctype')
        expect(shouldNotCache).to.not.exist
        done()
      }
    )
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

  // Redis doens't have a max items limit
  if (!process.env.REDIS_URL) {
    it('Sets max cache items correctly', done => {
      const cacheHtml = cacheManager.getCache('html')
      cacheHtml.reset()

      request.get(`${uri}/2017/12/01/item-one`, async () => {
        expect(await cacheHtml.keys()).to.have.length(1)
        request.get(`${uri}/2017/12/01/item-two`, async () => {
          expect(await cacheHtml.keys()).to.have.length(2)
          request.get(`${uri}/2017/12/01/item-three`, async () => {
            expect(await cacheHtml.keys()).to.have.length(2)
            expect(await cacheHtml.keys()).to.not.include('2017/12/01/one-item')
            done()
          })
        })
      })
    })
  }
})
