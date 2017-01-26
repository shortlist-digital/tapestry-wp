import request from 'supertest'
import { bootServer, mockApi } from '../utils'

// test a super basic Tapestry server with minimal config
describe('Minimal config', () => {

  let tapestry = null
  let config = {
    siteUrl: 'http://dummy.api:80'
  }

  beforeEach(done => {
    mockApi({ path: '/nonsense' })
    tapestry = bootServer(config, done)
  })
  afterEach(() => tapestry.stop())

  it('If route matched, respond with a 200', (done) => {
    request(tapestry.server.listener)
      .get('')
      .expect(200, done)
  })
  it('If errored API, respond with a 502', (done) => {
    request(tapestry.server.listener)
      .get('/nonsense')
      .expect(502, done)
  })
})
