import fs from 'fs'
import path from 'path'

import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'
import dataPage from '../mocks/page.json'

describe('Handling redirects', () => {

  let redirectsFilePath = path.resolve(process.cwd(), 'redirects.json')
  let tapestry = null
  let uri = null
  let config = {
    routes: [{
      path: 'page',
      component: () => <p>Redirected component</p>
    }],
    redirectPaths: {
      '/redirect/from/this-path': '/page',
      '/redirect/with/query': '/page'
    },
    redirectsEndpoint: 'http://dummy.api/web/app/uploads/redirects.json',
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // create redirects file sync to prevent race condition
    fs.writeFileSync(
      redirectsFilePath, // file name
      JSON.stringify({'/redirect/from/file': '/page' }), // create dummy file
      'utf8' // encoding
    )

    nock('http://dummy.api')
      .get('/web/app/uploads/redirects.json')
      .times(1)
      .reply(200, {'/redirect/from/endpoint': '/page'})

    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => {
    fs.unlink(redirectsFilePath) // tidy up redirects.json asynchronously
    tapestry.server.stop()
  })

  it('Redirect returns 308 status', (done) => {
    tapestry.server.inject(`${uri}/redirect/from/this-path`, (res) => {
      expect(res.statusCode).to.equal(308)
      done()
    })
  })

 it('Redirect path contains querystring', (done) => {
    const query = '?querystring=something'
    request.get(`${uri}/redirect/with/query${query}`, (err, res, body) => {
      expect(res.req.path).to.contain(`/page${query}`)
      done()
    })
  })

  it('Redirect path redirects correctly', (done) => {
    request.get(`${uri}/redirect/from/this-path`, (err, res, body) => {
      expect(body).to.contain('Redirected component')
      expect(res.statusCode).to.equal(200)
      done()
    })
  })

  it('Redirect path loaded from `redirects.json` file', (done) => {
    request.get(`${uri}/redirect/from/file`, (err, res, body) => {
      expect(body).to.contain('Redirected component')
      expect(res.statusCode).to.equal(200)
      done()
    })
  })

})

describe('Handling endpoint redirects', () => {
  let tapestry = null
  let uri = null
  let config = {
    routes: [{
      path: 'page',
      component: () => <p>Redirected component</p>
    }],
    redirectsEndpoint: 'http://dummy.api/web/app/uploads/redirects.json',
    siteUrl: 'http://dummy.api'
  }

  afterEach(() => {
    tapestry.server.stop()
  })

  it('Redirect path loaded from redirects endpoint', (done) => {

    nock('http://dummy.api')
      .get('/web/app/uploads/redirects.json')
      .times(1)
      .reply(200, {'/redirect/from/endpoint': '/page'})

    // boot tapestry server
    tapestry = bootServer(config)

    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      request.get(`${uri}/redirect/from/endpoint`, (err, res, body) => {
        expect(body).to.contain('Redirected component')
        expect(res.statusCode).to.equal(200)
        done()
      })
    })
  })

  it('Server handles 404 gracefully', (done) => {

    nock('http://dummy.api')
      .get('/web/app/uploads/redirects.json')
      .times(1)
      .reply(404)

    // boot tapestry server
    tapestry = bootServer(config)

    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      request.get(`${uri}/page`, (err, res, body) => {
        expect(body).to.contain('Redirected component')
        expect(res.statusCode).to.equal(200)
        done()
      })
    })
  })

   it('Server handles invalid data gracefully', (done) => {

    nock('http://dummy.api')
      .get('/web/app/uploads/redirects.json')
      .times(1)
      .reply(200, 'Error: <p>Something went wrong')

    // boot tapestry server
    tapestry = bootServer(config)

    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      request.get(`${uri}/page`, (err, res, body) => {
        expect(body).to.contain('Redirected component')
        expect(res.statusCode).to.equal(200)
        done()
      })
    })
  })

})
