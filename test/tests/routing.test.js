import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'
import dataPages from '../mocks/pages.json'

const prepareJson = (data) =>
  JSON.stringify(data)
    .replace(/\//g, '\\/')
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")


describe('Handling custom static routes', () => {

  let tapestry = null
  let uri = null
  let config = {
    routes: [{
      path: 'static-route',
      component: () => <p>Static route</p>
    }, {
      path: 'static-route/:custom',
      component: (props) => <p>Param: {props.params.custom}</p>
    }],
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Route matched, render component', (done) => {
    request.get(`${uri}/static-route`, (err, res, body) => {
      expect(body).to.contain('Static route')
      done()
    })
  })

  it('Route matched, params available in component', (done) => {
    request.get(`${uri}/static-route/dynamic-parameter`, (err, res, body) => {
      expect(body).to.contain('dynamic-parameter')
      done()
    })
  })
})

describe('Handling custom endpoint routes', () => {

  let tapestry = null
  let uri = null
  let config = {
    routes: [{
      path: 'basic-endpoint',
      endpoint: 'pages',
      component: () => <p>Basic endpoint</p>
    }, {
      path: 'dynamic-endpoint/:custom',
      endpoint: (params) => `pages?slug=${params.custom}`,
      component: () => <p>Custom endpoint</p>
    }],
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/pages')
      .reply(200, dataPages.data)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Route matched, custom endpoint works', (done) => {
    request.get(`${uri}/basic-endpoint`, (err, res, body) => {
      expect(body).to.contain(prepareJson(dataPages.data))
      done()
    })
  })
})
