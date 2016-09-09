# Tapestry

## Work In Progress

Very Work in Progress - Eventually:

```js
// Top level Component for your Wordpress frontend
import App from './components/App'
import Tapestry from 'wp-tapestry'

let tapestry = new Tapestry(App, 'http://wordpress-api-site.com')

tapestry.proxy('/robots.txt')
tapestry.proxy('/sitemap.xml')
tapestry.start('')
```

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
