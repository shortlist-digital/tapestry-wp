const expect = require('chai').expect
const Server = require('../dist/server').default
const request = require('supertest')
const nock = require('nock')
const React = require('react')


// test a super basic Tapestry server with minimal config
describe('Minimal config', function () {

  const config = {
    siteUrl: 'http://dummy.api:80'
  }
  const jsonResp = {
    username: 'pgte',
    email: 'pedro.teixeira@gmail.com',
    _id: '4324243fsd'
  }

  before(function (done) { this.tapestry = setup(config, done) })
  after(function () { this.tapestry.stop() })

  it('Homepage should respond with a 200', function (done) {
    request(this.tapestry.server.listener)
      .get('')
      .expect(200, done)
  })
  it('A page should return a Missing View Component', function (done) {
    request(this.tapestry.server.listener)
      .get('')
      .end((err, res) => {
        expect(res.text).to.contain('Missing component')
        done()
      })
  })
  it('Global ASYNC_PROPS should store data from API', function (done) {
    mockApi(
      '/wp-json/wp/v2/pages',
      { filter: { name: 'home' }},
      jsonResp
    )
    request(this.tapestry.server.listener)
      .get('')
      .end((err, res) => {
        expect(res.text).to.contain(`window.__ASYNC_PROPS__ = [{"resp":${JSON.stringify(jsonResp)}}]`)
        done()
      })
  })
})

// test the component loader
describe('Custom components', function () {

  const componentString = 'Test Content'
  const config = {
    components: {
      Post: () => React.createElement('div', null, componentString)
    },
    siteUrl: 'http://dummy.api:80'
  }

  before(function (done) { this.tapestry = setup(config, done) })
  after(function () { this.tapestry.stop() })

  it('Post should return with custom component text', function (done) {
    mockApi(
      '/wp-json/wp/v2/posts/10',
      { '_embed': true }
    )
    request(this.tapestry.server.listener)
      .get('/cat/slug/10')
      .end((err, res) => {
        expect(res.text).to.contain(componentString)
        done()
      })
  })
})

// test proxy stchuff
describe('Proxies', function () {

  const proxyFile = '/robots.txt'
  const proxyContents = 'Robots text file'
  const config = {
    proxyPaths: [proxyFile],
    siteUrl: 'http://dummy.api:80'
  }
  before(function (done) { this.tapestry = setup(config, done) })
  after(function () { this.tapestry.stop() })

  it('Proxy should return correct content', function (done) {
    mockApi(
      proxyFile,
      null,
      proxyContents
    )
    request(this.tapestry.server.listener)
      .get(proxyFile)
      .end((err, res) => {
        expect(res.text).to.contain(proxyContents)
        done()
      })
  })
})


const setup = (config, done) =>
  new Server({ config: { default: config } }, done)
const mockApi = (path, query, resp) =>
  nock('http://dummy.api')
    .get(path)
    .query(query || false)
    .reply(200, resp || {})
