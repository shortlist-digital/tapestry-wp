'use strict'

const Server = require('./dist/server').default
const nock = require('nock')
const fetch = require('isomorphic-fetch')

const thing = nock('http://dummy.api')
  .get('/robots.txt')
  .reply("STRING HELLO")

let Tapestry = new Server({
  config: {
    default: {
      proxyPaths: ['/robots.txt'],
      siteUrl: 'http://dummy.api'
    }
  }
})

// describe('Server', () => {
//
//   it('Exists', () => {
//     expect(Tapestry.config.serverUri).toBe('http://0.0.0.0:3030')
//   })
//
//   it('Returns a 404', () => {
//
//   })
// })

// setTimeout(() => {
  fetch('http://0.0.0.0:3030')
    .then(res => console.log(res))
    .catch(err => console.log(err))
// }, 5000)
