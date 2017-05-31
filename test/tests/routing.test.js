import React from 'react'
import request from 'request'
import { expect } from 'chai'
import Post from '../components/post'
import { bootServer, mockApi } from '../utils'
import pageData from '../mocks/page.json'

// test a super basic Tapestry server with minimal config
describe('Custom routes', () => {

  let tapestry = null
  let config = {
    routes: [{
      path: 'static-route',
      component: Post
    }, {
      path: 'static-route-with-param/:custom',
      component: (props) => <p>{props.params.custom}</p>
    }, {
      path: 'static-route-async',
      component: () => <p>This is async</p>
    }, {
      path: 'custom-endpoint/:dynamic',
      component: (props) => <p>{props.title.rendered}</p>,
      endpoint: (params) => `posts?slug=${params.dynamic}&_embed`
    }],
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    mockApi()
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })

  after(() => tapestry.server.stop())

  it('Static route matches, returns static component', (done) => {
    request
      .get(`${tapestry.server.info.uri}/static-route`, (err, res, body) => {
        expect(body).to.contain('Post title')
        done()
      })
  })

  it('Static route with parameter matched, parameters available in props', (done) => {
    request
      .get(`${tapestry.server.info.uri}/static-route-with-param/test-parameter`, (err, res, body) => {
        expect(body).to.contain('test-parameter')
        done()
      })
  })

  it('Static route matches, returns async component', (done) => {
    request
      .get(`${tapestry.server.info.uri}/static-route-async`, (err, res, body) => {
        expect(body).to.contain('This is async')
        done()
      })
  })

  it('Dynamic route matches, queries custom endpoint', (done) => {
    request
      .get(`${tapestry.server.info.uri}/custom-endpoint/hi`, (err, res, body) => {
        expect(body).to.contain(`window.__ASYNC_PROPS__ = [{"data":${
          JSON.stringify(pageData)
            .replace(/\//g, '\\/')
            .replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029")
        }}]`)
        done()
      })
  })
})
