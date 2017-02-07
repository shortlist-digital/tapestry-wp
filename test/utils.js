import nock from 'nock'
import Server from '../dist/server'
import data from './mocks/page.json'

export const bootServer = (config) =>
  new Server({
    config: { default: config }
  }, { silent: true })

export const mockApi = () =>
  nock('http://dummy.api')
    .get('/wp-json/wp/v2/pages')
    .times(5)
    .query({ filter: { name: 'home' }})
    .reply(200, data)
    .get('/wp-json/wp/v2/posts/10?_embed')
    .times(5)
    .reply(200, data)

export const mockProxy = ({ path, resp }) =>
  nock('http://dummy.api')
    .get(path)
    .times(5)
    .reply(200, resp)
