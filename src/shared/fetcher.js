import fetch from 'isomorphic-unfetch'

const fetcher = (url) => {
  // node only
  if (__SERVER__) {
    const http = require('http')
    const https = require('https')
    const startsWith = require('lodash.startswith')
    const Agent = startsWith(url, 'https')
      ? https.Agent
      : http.Agent
    return fetch(url, {
      agent: new Agent({
        keepAlive: true,
        keepAliveMsecs: 20000
      })
    })
  }

  return fetch(url)
}

export default fetcher
