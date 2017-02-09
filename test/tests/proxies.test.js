import { expect } from 'chai'
import request from 'request'
import { bootServer, mockProxy } from '../utils'

describe('Handling proxies', () => {

  let tapestry = null
  let proxyFile = '/robots.txt'
  let proxyContents = 'Test file'
  let config = {
    proxyPaths: [proxyFile],
    siteUrl: 'http://dummy.api:80'
  }


  before(done => {
    mockProxy({
      path: proxyFile,
      resp: proxyContents
    })
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })
  after(() => tapestry.server.stop())

  it('Proxy should return correct content', (done) => {
    request
      .get(tapestry.server.info.uri + proxyFile, (err, res, body) => {
          expect(body).to.contain(proxyContents)
          done()
        })
  })
  it('Undeclared proxy should return 404', (done) => {
    request
      .get(`${tapestry.server.info.uri}/test.txt`, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done()
      })
  })
})
