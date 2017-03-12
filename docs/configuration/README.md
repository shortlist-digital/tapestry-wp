# Configuring Tapestry

### `tapestry.config.js`

Configure your Tapestry project through it's `tapestry.config.js` file in the root folder. Tapestry will use this file on both the server and the client.

At it's simplest, you can pass in the `Post`, `Page`, and `Archive` React templates, and the URL to your WP-API enabled WordPress site

### Example configuration

```js
// Page template component
import Page from './components/views/page'
// Post template component
import Post from './components/views/post'
// FrontPage template component
import FrontPage from './components/views/home'
// Custom data loader for the FrontPage
import LoaderFrontPage from './loaders/front-page'
// Function for the router to call on ever page update, useful for analytics and scroll position
import { onPageUpdate } from './utils'

export default {
  components: {
    Page,
    Post,
    FrontPage
  },
  loaders: {
    FrontPage: LoaderFrontPage
  },
  siteUrl: 'http://shortliststudio.foundry.press',
  onPageUpdate: onPageUpdate
}
```
