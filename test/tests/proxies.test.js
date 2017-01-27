import { expect } from 'chai'
import request from 'supertest'
import { bootServer, mockApi } from '../utils'

describe('Handling proxies', () => {

  let tapestry = null
  let proxyFile = '/robots.txt'
  let proxyContents = 'Test file'
  let config = {
    proxyPaths: [proxyFile],
    siteUrl: 'http://dummy.api:80'
  }


  beforeEach(done => {
    mockApi({
      path: proxyFile,
      resp: proxyContents
    })
    tapestry = bootServer(config, done)
  })
  afterEach(() => tapestry.stop())


  it('Proxy should return correct content', (done) => {
    request(tapestry.server.listener)
      .get(proxyFile)
      .end((err, res) => {
        expect(res.text).to.contain(proxyContents)
        done()
      })
  })
  it('Undeclared proxy should return 404', (done) => {
    request(tapestry.server.listener)
      .get('/test.txt')
      .expect(404, done)
  })
})
