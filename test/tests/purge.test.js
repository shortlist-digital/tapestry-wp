import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'
import dataPost from '../mocks/post.json'
import dataPosts from '../mocks/posts.json'


describe('Handling purges', () => {

  let tapestry = null
  let uri = null
  let config = {
    components: {
      FrontPage: () => <p>Hello</p>,
      Post: () => <p>Hello</p>
    },
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/posts?_embed')
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/posts?slug=test&_embed')
      .reply(200, dataPost)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())


  it('Homepage is purgeable', (done) => {
    request.get(uri, (err, res, body) => {
      expect(body).to.contain('Hello')
      expect(res.statusCode).to.equal(200)
      request
        .get(`${uri}/purge//`, (err, res, body) => {
          const purgeResponse = JSON.stringify({ status: 'Purged /' })
          expect(body).to.contain(purgeResponse)
          expect(res.statusCode).to.equal(200)
          done()
        })
    })
  })

  it('Post is purgeable', (done) => {
    const postRoute = '2017/12/01/test'
    request.get(`${uri}/${postRoute}`, (err, res, body) => {
      expect(body).to.contain('Hello')
      expect(res.statusCode).to.equal(200)
      request
        .get(`${uri}/purge/${postRoute}`, (err, res, body) => {
          const purgeResponse = JSON.stringify({ status: `Purged ${postRoute}` })
          expect(body).to.contain(purgeResponse)
          expect(res.statusCode).to.equal(200)
          done()
        })
    })
  })
})
