# Tapestry
[![npm](https://img.shields.io/npm/v/tapestry-wp.svg)]()
[![CircleCI](https://circleci.com/gh/shortlist-digital/tapestry-wp/tree/develop.svg?style=shield)](https://circleci.com/gh/shortlist-digital/tapestry-wp/tree/develop)
[![dependencies Status](https://david-dm.org/shortlist-digital/tapestry-wp/status.svg)](https://david-dm.org/shortlist-digital/tapestry-wp)

Tapestry is a Universal JavaScript Application for rendering React front-ends via the Wordpress API.

_**Note:** This is currently a work in progress and will likely undergo major public/private API changes and feature updates._

## Using Tapestry
Install  `tapestry-wp` through `npm` or `yarn`
```js
npm install tapestry-wp --save
```
Map the Tapestry commands to `npm` scripts in your `package.json`
```js
"scripts": {
  "start": "tapestry",
  "start:prod": "tapestry build && tapestry start",
  "bootstrap": "tapestry init"
}
```
You can now either run `npm run bootstrap` to create a simple Tapestry project or manually add a `tapestry.config.js` to your project root.
```js
import Post from './components/post'
import Page from './components/page'

export default {
  components: {
    Post, Page
  },
  siteUrl: 'http://your-wordpress.url'
}
```

## Roadmap
Tapestry has a long list of features that we are looking to implement, including confirmed and super speculative features.
- [x] Server render React component tree
- [x] Bundle the app for the client
- [x] Provide production option for client bundle
- [x] Supply CLI to run the server
- [x] Hook up WP-API to match routes
- [x] Render `<head>` tags with `react-helmet`
- [x] Supply default routes
- [x] Integrate Glamor CSS-in-JS framework, rendering server-side, hydrating on the client
- [x] Ability to override data loaders
- [ ] Ability to override routing
- [ ] WordPress plugin to enable previewing, 'View Post' functionality and permalinks
- [ ] Create a global Redux store of page, post and archive data
- [ ] Handle Redirects
- [ ] Access options, menus through WP-API
