import Tapestry from '../src/boot'

const server = Tapestry({
  siteUrl: 'http://shortliststudio.foundry.press'
})

// request(server)
//   .get('/news/something/11')
//   .expect(200)
//   .end(function(err, res) {
//     if (err) throw err;
//   })
