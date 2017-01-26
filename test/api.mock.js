const nock = require('nock')

nock('http://dummy.api')
  .get('/wp-json/wp/v2/posts?filter[category_name]=page-test')
  .reply(200)
