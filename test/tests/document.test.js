import { expect } from 'chai'
import request from 'request'
import { bootServer, mockApi } from '../utils'
import pageData from '../mocks/page.json'
import style from '../../dist/default-style'

// test Tapestry components and data
describe('HTML document', () => {

  let tapestry = null
  let config = {
    siteUrl: 'http://dummy.api:80'
  }


  beforeEach(done => {
    mockApi({
      path: '/wp-json/wp/v2/pages',
      query: { filter: { name: 'home' }}
    })
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })
  afterEach(() => tapestry.server.stop())


  it('Data is correctly loaded on page', (done) => {
    console.log(tapestry.server.info.uri)
    request
      .get(tapestry.server.info.uri, (err, res, body) => {
        expect(body).to.contain(`window.__ASYNC_PROPS__ = [{"resp":${JSON.stringify(pageData)}}]`)
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
  it('Page should return default CSS', (done) => {
    request
      .get(tapestry.server.info.uri, (err, res, body) => {
        expect(body).to.contain(style)
        done()
      })
  })
})
