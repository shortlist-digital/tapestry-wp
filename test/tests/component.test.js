import React from 'react'
import { expect } from 'chai'
import request from 'request'
import { bootServer, mockApi } from '../utils'
import FrontPage from '../components/front-page'
import Error from '../components/error'
import data from '../mocks/page.json'
import { shallow } from 'enzyme'

// test Tapestry components and data
describe('Components', () => {

  let tapestry = null
  let config = {
    components: {
      FrontPage: () => <FrontPage {...data} />,
      Error: () => <Error />
    },
    siteUrl: 'http://dummy.api:80'
  }


  beforeEach(done => {
    mockApi({
      path: '/wp-json/wp/v2/pages',
      query: { filter: { name: 'home' }}
    })
    tapestry = bootServer(config)
    tapestry.server.on('start', done)
  })
  afterEach(() => tapestry.server.stop())


  it('Custom components are rendered', (done) => {
    request
      .get(tapestry.server.info.uri, (err, res, body) => {
        expect(body).to.contain(data.title.rendered)
        done()
      })
  })
  it('Error component is rendered', (done) => {
    request
      .get(`${tapestry.server.info.uri}/about/null-page`, (err, res, body) => {
        expect(body).to.contain('This is an error page')
        done()
      })
  })
})
