import React from 'react'
import request from 'request'
import { expect } from 'chai'
import Post from '../components/post'
import { bootServer, mockApi } from '../utils'

// test a super basic Tapestry server with minimal config
describe('Custom routes', () => {

  let tapestry = null
  let config = {
    routes: [{
      path: 'static-route',
      component: () => <Post />
    }, {
      path: 'static-route-with-param/:custom',
      component: (props) => <p>{props.params.custom}</p>
    }, {
      path: 'static-route-async',
      component: () => <p>This is async</p>
    }],
    siteUrl: 'http://dummy.api'
  }


  before(done => {
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })

  after(() => tapestry.server.stop())

  it('Static route matches, returns static component', (done) => {
    request
      .get(`${tapestry.server.info.uri}/static-route`, (err, res, body) => {
        expect(body).to.contain('Post title')
        done()
      })
  })

  it('Static route with parameter matched, parameters available in props', (done) => {
    request
      .get(`${tapestry.server.info.uri}/static-route-with-param/test-parameter`, (err, res, body) => {
        expect(body).to.contain('test-parameter')
        done()
      })
  })

  it('Static route matches, returns async component', (done) => {
    request
      .get(`${tapestry.server.info.uri}/static-route-async`, (err, res, body) => {
        expect(body).to.contain('This is async')
        done()
      })
  })
})
