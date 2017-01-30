import request from 'request'
import { expect } from 'chai'
import { bootServer, mockApi } from '../utils'

// test a super basic Tapestry server with minimal config
describe('Handing server responses', () => {

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


  it('Route matched, respond with a 200', (done) => {
    request
      .get(tapestry.server.info.uri, (err, res, body) => {
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
  it('Route not matched, respond with a 404', (done) => {
    request
      .get(`${tapestry.server.info.uri}/route/not/matched/in/any/way`, (err, res, body) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
  it('Route matched but API lacks data, respond with a 404', (done) => {
    request
      .get(`${tapestry.server.info.uri}/about/null-page`, (err, res, body) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
})
