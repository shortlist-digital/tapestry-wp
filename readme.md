# Tapestry

## Work In Progress

Very Work in Progress - Eventually:

```js
// Top level Component for your Wordpress frontend
import Base from './components/Base'
import Post from './components/Post'
import Page from './components/Page'

export default {
  components: {
    Base, Post, Page
  },
  proxyPaths: ['/robots.txt'],
  siteUrl: 'http://wordpress-api-site.com'
}
```

## Currently

Tapestry consumes a config object in the root of the parent project i.e. Shortlist, and outputs a Webpack bundle into `/public` and starts a node server.

## Todo

- [x] Render React components from the server
- [x] Bundle component tree and serve on the client
- [x] Hook up WP-API to match routes
- [x] Head overrides per page with `react-helmet`
- [x] Supply default routes
- [x] Integrate CSS-in-JS framework
- [ ] Access options, menus through WP-API
- [x] Ability to override loaders - Separate loaders and routes?
- [ ] Ability to override routes
- [ ] WordPress plugin to enable previewing and 'View Post' functionality
- [ ] Hydrate single page store
- [ ] Consider a global store of page, post and archive data
- [ ] Permalink WP-API plugin - integrate into Wordpress Tapestry
- [ ] Handle Redirects
- [ ] Hash client bundle, allow path and name override
- [x] Provide prod build option for client bundle
- [x] Define cli interface (https://medium.freecodecamp.com/writing-command-line-applications-in-nodejs-2cf8327eee2)
