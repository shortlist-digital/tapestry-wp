import React from 'react'
import { expect } from 'chai'
import request from 'request'
import nock from 'nock'

import { bootServer } from '../utils'
import dataPage from '../mocks/page.json'
import dataPost from '../mocks/post.json'
import dataPages from '../mocks/pages.json'
import dataPosts from '../mocks/posts.json'

const prepareJson = data =>
  JSON.stringify(data)
    .replace(/\//g, '\\/')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

describe('Handling custom static routes', () => {
  let tapestry = null
  let uri = null
  let config = {
    routes: [
      {
        path: 'static-route',
        component: () => <p>Static route</p>
      },
      {
        path: 'static-route/:custom',
        component: props => <p>Param: {props.params.custom}</p>
      }
    ],
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Route matched, render component', done => {
    request.get(`${uri}/static-route`, (err, res, body) => {
      expect(body).to.contain('Static route')
      done()
    })
  })

  it('Route matched, params available in component', done => {
    request.get(`${uri}/static-route/dynamic-parameter`, (err, res, body) => {
      expect(body).to.contain('dynamic-parameter')
      done()
    })
  })
})

describe('Handling custom endpoint routes', () => {
  let tapestry = null
  let uri = null
  let config = {
    routes: [
      {
        path: 'string-endpoint',
        endpoint: 'pages',
        component: () => <p>Basic endpoint</p>
      },
      {
        path: 'array-endpoint',
        endpoint: ['pages', 'posts'],
        component: () => <p>Custom endpoint</p>
      },
      {
        path: 'object-endpoint',
        endpoint: {
          pages: 'pages',
          posts: 'posts'
        },
        component: () => <p>Custom endpoint</p>
      },
      {
        path: 'dynamic-string-endpoint/:custom',
        endpoint: params => `pages?slug=${params.custom}`,
        component: () => <p>Custom endpoint</p>
      },
      {
        path: 'dynamic-array-endpoint/:custom',
        endpoint: params => [
          `pages?slug=${params.custom}`,
          `posts?slug=${params.custom}`
        ],
        component: () => <p>Custom endpoint</p>
      },
      {
        path: 'dynamic-object-endpoint/:custom',
        endpoint: params => ({
          page: `pages?slug=${params.custom}`,
          post: `posts?slug=${params.custom}`
        }),
        component: () => <p>Custom endpoint</p>
      }
    ],
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/wp/v2/pages')
      .times(5)
      .reply(200, dataPages.data)
      .get('/wp-json/wp/v2/posts')
      .times(5)
      .reply(200, dataPosts.data)
      .get('/wp-json/wp/v2/posts?slug=test')
      .times(5)
      .reply(200, dataPost)
      .get('/wp-json/wp/v2/pages?slug=test')
      .times(5)
      .reply(200, dataPage)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Route matched, string endpoint works', done => {
    request.get(`${uri}/string-endpoint`, (err, res, body) => {
      expect(body).to.contain(prepareJson(dataPages.data))
      done()
    })
  })

  it('Route matched, array endpoint works', done => {
    request.get(`${uri}/array-endpoint`, (err, res, body) => {
      const expectedJson = [
        {
          data: [dataPages.data, dataPosts.data]
        }
      ]
      expect(body).to.contain(prepareJson(expectedJson))
      done()
    })
  })

  it('Route matched, object endpoint works', done => {
    request.get(`${uri}/object-endpoint`, (err, res, body) => {
      const expectedJson = [
        {
          data: {
            pages: dataPages.data,
            posts: dataPosts.data
          }
        }
      ]
      expect(body).to.contain(prepareJson(expectedJson))
      done()
    })
  })

  it('Route matched, dynamic string endpoint works', done => {
    request.get(`${uri}/dynamic-string-endpoint/test`, (err, res, body) => {
      expect(body).to.contain(prepareJson(dataPage))
      done()
    })
  })

  it('Route matched, dynamic array endpoint works', done => {
    request.get(`${uri}/dynamic-array-endpoint/test`, (err, res, body) => {
      const expectedJson = [
        {
          data: [dataPage, dataPost]
        }
      ]
      expect(body).to.contain(prepareJson(expectedJson))
      done()
    })
  })

  it('Route matched, dynamic object endpoint works', done => {
    request.get(`${uri}/dynamic-object-endpoint/test`, (err, res, body) => {
      const expectedJson = [
        {
          data: {
            page: dataPage,
            post: dataPost
          }
        }
      ]
      expect(body).to.contain(prepareJson(expectedJson))
      done()
    })
  })
})

describe('Handling preview endpoint routes', () => {
  let tapestry = null
  let uri = null
  let config = {
    routes: [
      {
        path: 'path-without-embed',
        endpoint: 'pages/10',
        component: () => <p>Basic endpoint</p>
      },
      {
        path: 'path-with-embed',
        endpoint: 'pages/10?_embed',
        component: () => <p>Basic endpoint</p>
      }
    ],
    siteUrl: 'http://dummy.api'
  }

  before(done => {
    // mock api response
    nock('http://dummy.api')
      .get('/wp-json/revision/v1/pages/10?tapestry_hash=hash&p=10')
      .reply(200, dataPage)
      .get('/wp-json/revision/v1/pages/10?_embed&tapestry_hash=hash&p=10')
      .reply(200, dataPage)
    // boot tapestry server
    tapestry = bootServer(config)
    tapestry.server.on('start', () => {
      uri = tapestry.server.info.uri
      done()
    })
  })

  after(() => tapestry.server.stop())

  it('Preview route without embed, endpoint works', done => {
    request.get(
      `${uri}/path-without-embed?tapestry_hash=hash&p=10`,
      (err, res, body) => {
        expect(body).to.contain(prepareJson(dataPage))
        done()
      }
    )
  })

  it('Preview route with embed, endpoint works', done => {
    request.get(
      `${uri}/path-with-embed?tapestry_hash=hash&p=10`,
      (err, res, body) => {
        expect(body).to.contain(prepareJson(dataPage))
        done()
      }
    )
  })
})
