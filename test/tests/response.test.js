import request from 'supertest'
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
    tapestry = bootServer(config, done)
  })
  afterEach(() => tapestry.stop())


  it('Route matched, respond with a 200', (done) => {
    request(tapestry.server.listener)
      .get('/')
      .expect(200, done)
  })
  it('Route not matched, respond with a 404', (done) => {
    request(tapestry.server.listener)
      .get('/route/not/matched/in/any/way')
      .expect(404, done)
  })
  it('Route matched but API lacks data, respond with a 404', (done) => {
    request(tapestry.server.listener)
      .get('/about/null-page')
      .expect(404, done)
  })
})
