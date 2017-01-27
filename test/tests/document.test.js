import { expect } from 'chai'
import request from 'supertest'
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
    tapestry = bootServer(config, done)
  })
  afterEach(() => tapestry.stop())


  it('Data is correctly loaded on page', (done) => {
    request(tapestry.server.listener)
      .get('/')
      .end((err, res) => {
        expect(res.text).to.contain(`window.__ASYNC_PROPS__ = [{"resp":${JSON.stringify(pageData)}}]`)
        done()
      })
  })
  it('If no component passed, Missing component rendered', (done) => {
    request(tapestry.server.listener)
      .get('/')
      .end((err, res) => {
        expect(res.text).to.contain('Missing component')
        done()
      })
  })
  it('Page should return default CSS', (done) => {
    request(tapestry.server.listener)
      .get('/')
      .end((err, res) => {
        expect(res.text).to.contain(style)
        done()
      })
  })
})
