import http  from 'http'
import https from 'https'
import fetch from 'isomorphic-fetch'
import startsWith from 'lodash.startswith'


const fetcher = (url) => {
  const Agent = startsWith(url, 'https') ? https.Agent : http.Agent
  const fetchOptions = {
    agent: new Agent({ keepAlive: true }),
    timeout: 5000
  }
  return fetch(url, fetchOptions)
}

export default fetcher
