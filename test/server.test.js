'use strict'

const React = require('react')
const assert = require('assert')
const Server = require('../dist/server').default
const request = require('supertest')
const nock = require('nock')

// nock.enableNetConnect()
//
const mockedApi = nock('http://dummy.api')
  .defaultReplyHeaders({ 'Content-Type': 'application/json' })
  .log(console.log)
const thingaling = {
  username: 'pgte',
  email: 'pedro.teixeira@gmail.com',
  _id: '4324243fsd'
}
mockedApi
  .get('/wp-json/wp/v2/pages?filter[name]=home')
  .reply(200, thingaling)
mockedApi
  .get('/wp-json/wp/v2/posts/10?_embed')
  .reply(200, thingaling)



describe('Minimum config', () => {

  let tapestry = null
  const config = {
    siteUrl: 'http://dummy.api:80'
  }

  before(done => {
    tapestry = new Server({ config: { default: config } }, done)
  })

  it('Homepage should respond with a 200', done => {
    request(tapestry.server.listener)
      .get('')
      .expect(200)
      .end(done)
  })

  it('Homepage should respond with a missing view component', done => {
    request(tapestry.server.listener)
      .get('')
      .expect(res => res.text.includes('Missing component'))
      .end(done)
  })

  it('ASYNC_PROPS should store response from API', done => {
    request(tapestry.server.listener)
      .get('')
      .expect(res =>
        res.text.includes(`window.__ASYNC_PROPS__ = [{"resp":${JSON.stringify(thingaling)}}]`)
      )
      .end(done)
  })

  after(() => {
    tapestry.stop()
  })
})

describe('Custom components', () => {

  let tapestry = null
  const config = {
    components: {
      Post: () => React.createElement('div', null, 'Test content')
    },
    siteUrl: 'http://dummy.api:80'
  }

  before(done => {
    tapestry = new Server({ config: { default: config } }, done)
  })

  it('Home should respond with defined component', done => {
    request(tapestry.server.listener)
      .get('/category/slug/10')
      .expect(res => console.log(res))
      .end(done)
  })

  after(() => {
    tapestry.stop()
  })
})
