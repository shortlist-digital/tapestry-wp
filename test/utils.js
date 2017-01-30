import nock from 'nock'
import Server from '../dist/server'
import data from './mocks/page.json'

export const bootServer = (config, done) =>
  new Server({
    config: { default: config }
  })

export const mockApi = ({
  url = 'http://dummy.api',
  query = false,
  path,
  resp
}) =>
  nock(url)
    // .log(console.log)
    .get(path)
    .query(query)
    .reply(200, resp || data)
