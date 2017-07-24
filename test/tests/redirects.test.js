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
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // create redirects file sync to prevent race condition
    fs.writeFileSync(
      redirectsFilePath, // file name
      JSON.stringify({'/redirect/from/file': '/page' }), // create dummy file
      'utf8' // encoding
    )

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
      console.log(res.statusCode, body)
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
