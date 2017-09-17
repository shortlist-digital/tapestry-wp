import http from 'http'

export default{
  agent: new http.Agent({ keepAlive: true }),
  timeout: 5000
}
