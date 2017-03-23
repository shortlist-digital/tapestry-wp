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
      FrontPage,
      CustomError
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

  it('CustomError will be rendered if declared', (done) => {
    request
      .get(`${tapestry.server.info.uri}/route/not/matched/in/any/way`, (err, res, body) => {
        expect(body).to.contain('This is an error page')
        done()
      })
  })

  it('Helmet <head> is rendered', (done) => {
    request
      .get(`${tapestry.server.info.uri}/2017/01/01/slug`, (err, res, body) => {
        expect(body).to.contain('Content in title tag')
        done()
      })
  })
})
