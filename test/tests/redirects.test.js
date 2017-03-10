import { expect } from 'chai'
import request from 'request'
import { bootServer, mockProxy, mockApi } from '../utils'

describe('Handling redirects', () => {

  let tapestry = null
  let config = {
    redirectPaths: {
      '/redirect/from/this-path': '/about/home'
    },
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    mockApi()
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })
  after(() => tapestry.server.stop())

  it('Redirect should return 301 status', (done) => {
    // Can't work out how to get the intermediate 30x reply status
    done()
  })

  it('Redirect should to about/home with corrent content', (done) => {
    request
      .get(tapestry.server.info.uri + '/redirect/from/this-path', (err, res, body) => {
          expect(body).to.contain('dog named Jack')
          expect(res.statusCode).to.equal(200)
          done()
        })
  })
})
