import { expect } from 'chai'
import request from 'request'
import { bootServer, mockProxy, mockApi } from '../utils'
import Page from '../components/page'

describe('Handling purges', () => {

  let tapestry = null
  let config = {
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

  it('Homepage should be purgeable', (done) => {
    request
      .get(tapestry.server.info.uri, (err, res, body) => {
          expect(body).to.contain('dog named Jack')
          expect(res.statusCode).to.equal(200)
          request
            .get(tapestry.server.info.uri + '/purge//', (err, res, body) => {
                expect(body).to.contain(JSON.stringify({status: 'Purged /'}))
                expect(res.statusCode).to.equal(200)
                done()
            })
        })
  })

   it('A post should be purgeable', (done) => {
    request
      .get(tapestry.server.info.uri + '/2017/12/01/hi', (err, res, body) => {
          expect(body).to.contain('dog named Jack')
          expect(res.statusCode).to.equal(200)
          request
            .get(tapestry.server.info.uri + '/purge/2017/12/01/hi', (err, res, body) => {
                expect(body).to.contain(JSON.stringify({status: 'Purged 2017/12/01/hi'}))
                expect(res.statusCode).to.equal(200)
                done()
            })
        })
  })
})
