import nock from 'nock'
import { server } from '../dist/server.bundle'
import data from './mocks/page.json'

const dataError = { data: { status: 404 } }

export const bootServer = (config) =>
  server({
    config: { default: config },
    env: 'test'
  }, {
    silent: true
  })

export const mockApi = () =>
  nock('http://dummy.api')

    .get('/wp-json/wp/v2/pages')
    .times(5)
    .query({ filter: { name: 'home' }})
    .reply(200, data)

    .get('/wp-json/wp/v2/posts/10?_embed')
    .times(5)
    .reply(200, data)

    .get('/wp-json/wp/v2/pages')
    .times(5)
    .query({ filter: { name: 'null-page' }})
    .reply(404, dataError)

    .get('/wp-json/wp/v2/posts')
    .query({ filter: { category_name: 'test.txt' }})
    .times(5)
    .reply(404, dataError)

export const mockProxy = ({ path, resp }) =>
  nock('http://dummy.api')
    .get(path)
    .times(5)
    .reply(200, resp)
