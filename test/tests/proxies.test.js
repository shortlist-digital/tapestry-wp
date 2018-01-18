import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'

describe('Handling static proxies', () => {
  let tapestry = null
  let uri = null
  let proxyPath = '/robots.txt'
  let proxyContents = 'Test file'
  let config = {
    proxyPaths: [proxyPath],
    siteUrl: 'http://dummy.api',
    components: {}
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get(proxyPath)
      .reply(200, proxyContents)
      .get('/wp-json/wp/v2/pages?slug=test.txt&_embed')
      .reply(404, { data: { status: 404 } })
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Proxy should return correct content', done => {
    request.get(uri + proxyPath, (err, res, body) => {
      expect(body).to.contain(proxyContents)
      done()
    })
  })

  it('Undeclared proxy should return 404', done => {
    request.get(`${uri}/test.txt`, (err, res) => {
      expect(res.statusCode).to.equal(404)
      done()
    })
  })
})

describe('Handling wildcard proxies', () => {
  let tapestry = null
  let uri = null
  let proxyPath = '/sitemap/{sitemapId}'
  let proxyContents = 'Test file'
  let config = {
    proxyPaths: [proxyPath],
    siteUrl: 'http://dummy.api',
    components: {}
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/sitemap/test.xml')
      .reply(200, proxyContents)
      .get('/sitemap/different-id.xml')
      .reply(200, proxyContents)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Proxy should return correct content from test a', done => {
    request.get(uri + '/sitemap/test.xml', (err, res, body) => {
      expect(body).to.contain(proxyContents)
      done()
    })
  })

  it('Proxy should return correct content from test b', done => {
    request.get(uri + '/sitemap/different-id.xml', (err, res, body) => {
      expect(body).to.contain(proxyContents)
      done()
    })
  })
})
