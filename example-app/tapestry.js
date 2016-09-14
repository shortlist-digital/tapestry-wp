import Tapestry from '../app-server'
import Base from './Base'
import Post from './components/post'
import Page from './components/page'

// let tapestryConfig = {
//   components: {
//     base: Base,
//     post: Post,
//     page: Page,
//     archive: null,
//     tag: null,
//     author: null
//   },
//   siteUrl: 'http://shortliststudio.foundry.press',
//   routes: null
// }

let tapestryConfig = {
  components: {
    Base: Base,
    Post: Post,
    Page: Page,
  },
  siteUrl: 'http://shortliststudio.foundry.press',
}


let tapestry = new Tapestry(tapestryConfig)

tapestry.proxy('/robots.txt')
tapestry.proxy('/sitemap.xml')

tapestry.start()
