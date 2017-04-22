import nock from 'nock'
import Server from '../src/server'
import pageData from './mocks/page.json'

const cwd = process.cwd()
const env = 'test'
const dataError = { data: { status: 404 } }

export const bootServer = (config, options = {}) => {
  // mock webpack provided environment variable
  global.__DEV__ = options.__DEV__ === false ? false : true
  // create and return a new Tapestry instance
  return new Server({
    config: { ...config, port: 5050 },
    cwd,
    env
  }, { silent: true })
}

export const mockApi = () =>
  nock('http://dummy.api')
    .get('/wp-json/wp/v2/posts?_embed')
    .times(5)
    .reply(200, pageData)

    .get('/wp-json/wp/v2/posts?slug=hi&_embed')
    .times(10)
    .reply(200, pageData)

    .get('/wp-json/wp/v2/pages')
    .times(5)
    .reply(200, pageData)

    .get('/wp-json/wp/v2/pages?slug=home&_embed')
    .times(5)
    .reply(200, pageData)

    .get('/wp-json/wp/v2/pages?slug=sample-page&_embed')
    .times(5)
    .reply(200, pageData)

    .get('/wp-json/wp/v2/posts/10?_embed')
    .times(5)
    .reply(200, pageData)

    .get('/wp-json/wp/v2/pages?slug=null-page&_embed')
    .times(5)
    .reply(404, dataError)

export const mockProxy = ({ path, resp }) =>
  nock('http://dummy.api')

    .get(path)
    .times(5)
    .reply(200, resp)

    .get('/wp-json/wp/v2/pages?slug=test.txt&_embed')
    .times(5)
    .reply(404, dataError)
