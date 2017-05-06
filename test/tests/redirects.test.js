import { expect } from 'chai'
import request from 'request'
import { bootServer, mockProxy, mockApi } from '../utils'
import Page from '../components/page'

describe('Handling redirects', () => {

  let tapestry = null
  let config = {
    redirectPaths: {
      '/redirect/from/this-path': '/about/home'
    },
    siteUrl: 'http://dummy.api',
    components: {
      Page
    }
  }

  before(done => {
    mockApi()
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })

  after(() => tapestry.server.stop())

  // http://stackoverflow.com/questions/42136829/whats-difference-between-http-301-and-308-status-codes
  it('Redirect should return 308 status', (done) => {
    tapestry.server.inject(tapestry.server.info.uri + '/redirect/from/this-path', (res) => {
          expect(res.statusCode).to.equal(308)
          done()
        })
  })

  it('Redirect should end up at about/home with correct content', (done) => {
    request
      .get(tapestry.server.info.uri + '/redirect/from/this-path', (err, res, body) => {
          expect(body).to.contain('dog named Jack')
          expect(res.statusCode).to.equal(200)
          done()
        })
  })
})
