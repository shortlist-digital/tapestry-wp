import React from 'react'
import { expect } from 'chai'
import request from 'request'
import { bootServer, mockApi } from '../utils'
import FrontPage from '../components/front-page'
import CustomError from '../components/error'
import Post from '../components/post'
import pageData from '../mocks/page.json'

// test Tapestry components and data
describe('Components', () => {

  let tapestry = null
  let config = {
    components: {
      Post,
      FrontPage
    },
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    mockApi()
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })

  after(() => tapestry.server.stop())

  it('Custom components are rendered', (done) => {
    request
      .get(tapestry.server.info.uri, (err, res, body) => {
        expect(body).to.contain(pageData.title.rendered)
        done()
      })
  })

  it('Helmet <head> is rendered', (done) => {
    request
      .get(`${tapestry.server.info.uri}/2017/12/01/hi`, (err, res, body) => {
        expect(body).to.contain('Content in title tag')
        done()
      })
  })
})


describe('Error view', () => {

  let tapestry = null
  let config = {
    components: {},
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    mockApi()
    done()
  })

  afterEach(() => tapestry.server.stop())

  it('If Component/CustomError missing in DEV, render Missing View', (done) => {
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      request
        .get(tapestry.server.info.uri, (err, res, body) => {
          expect(body).to.contain('Missing component')
          done()
        })
    })
  })

  it('If Component/CustomError missing in PROD, render Default Error', (done) => {
    tapestry = bootServer(config, { __DEV__: false })
    tapestry.server.on('start', () => {
      request
        .get(tapestry.server.info.uri, (err, res, body) => {
          expect(body).to.contain('Missing component')
          done()
        })
    })
  })

  it('If Component missing and CustomError declared in DEV, render CustomError', (done) => {
    tapestry = bootServer({
      ...config,
      components: { CustomError }
    })
    tapestry.server.on('start', () => {
      request
        .get(`${tapestry.server.info.uri}/route/not/matched/in/any/way`, (err, res, body) => {
          expect(body).to.contain('This is an error page')
          done()
        })
    })
  })

  it('If Component missing and CustomError declared in PROD, render CustomError', (done) => {
    tapestry = bootServer({
      ...config,
      components: { CustomError }
    }, { __DEV__: false })
    tapestry.server.on('start', () => {
      request
        .get(`${tapestry.server.info.uri}/route/not/matched/in/any/way`, (err, res, body) => {
          expect(body).to.contain('This is an error page')
          done()
        })
    })
  })
})
