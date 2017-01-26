import nock from 'nock'
import Server from '../dist/server'
import resp from './mocks/page.json'

export const bootServer = (config, done) =>
  new Server({
    config: {
      default: config
    }
  }, done)

export const mockApi = ({
  url = 'http://dummy.api',
  path,
  query = false
}) =>
  nock(url)
    .get(path)
    .query(query)
    .reply(200, resp)
