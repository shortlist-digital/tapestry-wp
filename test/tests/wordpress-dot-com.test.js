import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'
import dataPosts from '../mocks/posts.json'
import dataPages from '../mocks/posts.json'

describe('Handling server responses using Wordpress.com API', () => {
  let tapestry = null
  let uri = null
  let config = {
    routes: [
      {
        path: '/',
        endpoint: 'posts?_embed',
        component: () => <p>Hello</p>
      },
      {
        path: '/:cat/:subcat/:id',
        component: () => <p>Hello</p>
      },
      {
        path: '/404-response',
        endpoint: 'pages?slug=404-response',
        component: () => <p>Hello</p>
      },
      {
        path: '/empty-response',
        endpoint: 'pages?slug=empty-response',
        component: () => <p>Hello</p>
      },
      {
        path: '/empty-allowed-response',
        endpoint: 'pages?slug=empty-response',
        options: { allowEmptyResponse: true },
        component: () => <p>Hello</p>
      },
      {
        path: '/object-endpoint',
        endpoint: {
          pages: 'pages',
          posts: 'posts'
        },
        component: () => <p>Custom endpoint</p>
      },
      {
        path: '/static-endpoint',
        component: () => <p>Static endpoint</p>
      }
    ],
    siteUrl: 'http://dummy.site.wordpress.com',
    options: {
      wordpressDotComHosting: true
    }
  }

  before(done => {
    // mock api response
    nock('https://public-api.wordpress.com')
      .get('/wp/v2/sites/dummy.site.wordpress.com/posts/571')
      .times(1)
      .reply(200, dataPages.data)
      .get('/wp/v2/sites/dummy.site.wordpress.com/posts')
      .times(1)
      .reply(200, dataPages.data)
      .get('/wp/v2/sites/dummy.site.wordpress.com/pages')
      .times(1)
      .reply(200, dataPosts.data)
      .get('/wp/v2/sites/dummy.site.wordpress.com/posts?_embed')
      .times(5)
      .reply(200, dataPosts.data)
      .get('/wp/v2/sites/dummy.site.wordpress.com/pages?slug=404-response')
      .times(5)
      .reply(404, { data: { status: 404 } })
      .get('/wp/v2/sites/dummy.site.wordpress.com/pages?slug=empty-response')
      .times(5)
      .reply(200, [])
    // boot tapestry server
    process.env.CACHE_CONTROL_MAX_AGE = 60
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

  it('WP.com Route matched, status code is 200', done => {
    request.get(uri, (err, res) => {
      expect(res.statusCode).to.equal(200)
      done()
    })
  })

  it('WP.com Route not matched, status code is 404', done => {
    request.get(`${uri}/route/not/matched/in/any/way`, (err, res) => {
      expect(res.statusCode).to.equal(404)
      done()
    })
  })

  it('WP.com Route matched, API 404, status code is 404', done => {
    request.get(`${uri}/404-response`, (err, res) => {
      expect(res.statusCode).to.equal(404)
      done()
    })
  })

  it('WP.com Route matched, API empty response, status code is 404', done => {
    request.get(`${uri}/empty-response`, (err, res) => {
      expect(res.statusCode).to.equal(404)
      done()
    })
  })

  it('WP.com Route matched, API empty but allowed, status code is 200', done => {
    request.get(`${uri}/empty-allowed-response`, (err, res) => {
      expect(res.statusCode).to.equal(200)
      done()
    })
  })

  it('Route matched, multiple API requests, status code is 200', done => {
    request.get(`${uri}/object-endpoint`, (err, res) => {
      expect(res.statusCode).to.equal(200)
      done()
    })
  })

  it('Static route matched, no data loaded, status code is 200', done => {
    request.get(`${uri}/static-endpoint`, (err, res) => {
      expect(res.statusCode).to.equal(200)
      done()
    })
  })
})
