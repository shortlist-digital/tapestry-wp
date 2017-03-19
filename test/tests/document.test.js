import React from 'react'
import { expect } from 'chai'
import request from 'request'
import { bootServer, mockApi } from '../utils'
import pageData from '../mocks/page.json'
import Page from '../components/page'
import { css } from 'glamor'

// test Tapestry components and data
describe('HTML document', () => {
  let tapestry = null
  let config = {
    components: {
      Page
    },
    siteUrl: 'http://dummy.api'
  }

  beforeEach(done => {
    mockApi()
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })

  afterEach(() => {
    tapestry.server.emit('reset-cache')
    tapestry.server.stop()
  })

  it('Data is correctly loaded on page', (done) => {
    request
      .get(`${tapestry.server.info.uri}/sample-page`, (err, res, body) => {
        expect(body).to.contain(`window.__ASYNC_PROPS__ = [{"data":${JSON.stringify(pageData)}}]`)
        done()
      })
  })

  it('Page should render project Glamor CSS', (done) => {
    request
      .get(`${tapestry.server.info.uri}/sample-page`, (err, res, body) => {
        expect(body).to.contain('#bada55')
        done()
      })
  })
})
