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

Tapestry consumes a config object in the root of the parent project i.e. Shortlist, from this source it will output a webpack bundle into `/public` and start a node server.

This will handle routing, data fetching, server side rendering, client side navigation... bundle processing. You name it. Hopefully...

## Todo

 - React Helmet integration for handling `<head>` meta data that changes page to page
 - Ability to override routes object
 - Default routing
 - Accompanying WordPress plugin to enable preving and 'View Post' functionality
 - Hydrate single page store
 - Consider a global store of page, post and archive data
 - Possible permalink WP-API plugin - integrate into Wordpress Tapestry
 - Handle Redirects
 - Think about CSS
