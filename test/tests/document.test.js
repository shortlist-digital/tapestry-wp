import React from 'react'
import { expect } from 'chai'
import request from 'request'
import { bootServer, mockApi } from '../utils'
import pageData from '../mocks/page.json'
import style from '../../dist/default-style'
import { css } from 'glamor'

// test Tapestry components and data
describe('HTML document', () => {

  let color = '#639'
  let tapestry = null
  let config = {
    components: {
      Post: () => <div className={css({ color: color })}>Test</div>
    },
    siteUrl: 'http://dummy.api'
  }


  before(done => {
    mockApi()
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })
  after(() => tapestry.server.stop())


  it('Data is correctly loaded on page', (done) => {
    request
      .get(tapestry.server.info.uri, (err, res, body) => {
        expect(body).to.contain(`window.__ASYNC_PROPS__ = [{"data":${JSON.stringify(pageData)}}]`)
        done()
      })
  })
  it('If no component passed, Missing component rendered', (done) => {
    request
      .get(tapestry.server.info.uri, (err, res, body) => {
        expect(body).to.contain('Missing component')
        done()
      })
  })
  it('Page should render project Glamor CSS', (done) => {
    request
      .get(`${tapestry.server.info.uri}/cat/slug/10`, (err, res, body) => {
        // console.log(body)
        expect(body).to.contain(color)
        done()
      })
  })
})
