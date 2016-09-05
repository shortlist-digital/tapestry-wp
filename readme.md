# Tapestry

## Work In Progress

Very Work in Progress - Eventually:

```js
// Top level Component for your Wordpress frontend
import App from './components/App'
import Tapestry from 'wp-tapestry'

let server = new Tapestry(App, 'http://site.com/wp-json')
server.start()
```

This will handle routing, data fetching, server side rendering, client side navigation... bundle processing. You name it. Hopefully...
