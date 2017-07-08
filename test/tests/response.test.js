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
    routes: [{
      path: '/',
      endpoint: 'posts?_embed',
      component: () => <p>Hello</p>
    }, {
      path: '/404-response',
      endpoint: 'pages?slug=404-response',
      component: () => <p>Hello</p>
    }, {
      path: '/empty-response',
      endpoint: 'pages?slug=empty-response',
      component: () => <p>Hello</p>
    }, {
      path: '/empty-allowed-response',
      endpoint: 'pages?slug=empty-response',
      options: { allowEmptyResponse: true },
      component: () => <p>Hello</p>
    }, {
      path: '/404-array-response',
      endpoint: ['posts?_embed', 'pages?slug=404-response'],
      component: () => <p>Hello</p>
    }],
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .times(5)
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/pages?slug=404-response')
      .times(5)
      .reply(404, { data: { status: 404 } })
      .get('/wp-json/wp/v2/pages?slug=empty-response')
      .times(5)
      .reply(200, [])
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

  it('Route matched, API 404, status code is 404', (done) => {
    request
      .get(`${uri}/404-response`, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })

  it('Route matched, API empty response, status code is 404', (done) => {
    request
      .get(`${uri}/empty-response`, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })

  it('Route matched, API empty but allowed, status code is 200', (done) => {
    request
      .get(`${uri}/empty-allowed-response`, (err, res) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
  })

  // it('Route matched, API array 404, status code is 404', (done) => {
  //   request
  //     .get(`${uri}/404-array-response`, (err, res) => {
  //       expect(res.statusCode).to.equal(404)
  //       done()
  //     })
  // })
})
