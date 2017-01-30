import React from 'react'
import { expect } from 'chai'
import request from 'request'
import { bootServer, mockApi } from '../utils'
import FrontPage from '../components/front-page'
import data from '../mocks/page.json'
import { shallow } from 'enzyme'

// test Tapestry components and data
describe('Components', () => {

  let tapestry = null
  let config = {
    components: {
      FrontPage: () => <FrontPage {...data} />
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
        expect(body).to.contain(shallow(<FrontPage {...data} />).html())
        done()
      })
  })
})
