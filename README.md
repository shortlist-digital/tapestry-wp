<p align="center">
  <img src="https://cdn.rawgit.com/shortlist-digital/tapestry-wp/master/logo/tapestry-logo-glyph.svg">
  <br>
  <a href="https://www.npmjs.org/package/tapestry-wp"><img src="https://img.shields.io/npm/v/tapestry-wp.svg?style=flat" alt="npm"></a> <a href="https://circleci.com/gh/shortlist-digital/tapestry-wp/tree/master"><img src="https://circleci.com/gh/shortlist-digital/tapestry-wp/tree/master.svg?style=shield" alt="circleci"></a> <a href="https://snyk.io/test/github/shortlist-digital/tapestry-wp"><img src="https://snyk.io/test/github/shortlist-digital/tapestry-wp/badge.svg" alt="snyk"></a>
</p>

# Tapestry

An opinionated React SPA service for the WordPress Rest API. Create React components and let Tapestry handle the data loading, server rendering, JavaScript bundling and more.

## Features

- Data handling
- Server rendered React
- Small, secure Node server through Hapi
- CSS-in-JS out of the box
- Hot reloading
- Production ready

## Installation

`yarn add tapestry-wp react react-dom`

## Usage

Tapestry has a couple of commands to handle building and running the project, you can pop these into your NPM scripts.

`tapestry` will create the client/server bundles and run the server in development mode, `tapestry build` will create the client and server bundles in production mode and `tapestry start` will run the server in production mode.

```json
{
  "scripts": {
    "start": "tapestry",
    "build": "tapestry build",
    "start:prod": "tapestry start"
  }
}
```

Create a `tapestry.config.js` in the root of your project and export an object with your WordPress site URL and routes or components to render.

```js
import Post from './components/post'
import Page from './components/page'

export default {
  siteUrl: 'http://your-wordpress.url',
  components: { Post, Page }
}
```

These components will match the default WordPress permalink routes for each page type. e.g. `/2017/12/08/a-post-slug`. You can override these default routes by adding a `routes` array to our config.

Each route requires a `path` and a `component`, to access data from WordPress pass in an `endpoint`

```js
import Post from './components/post'
import Page from './components/page'

export default {
  siteUrl: 'http://your-wordpress.url',
  routes: [{
    path: '/:slug/:id',
    endpoint: id => `posts/${id}`,
    component: Post
  }, {
    path: '/about/:slug',
    endpoint: slug => `pages?filter=${slug}`,
    component: Page
  }]
}
```

Once these are set up, you're free to start building your site and writing React components.

## Options

`tapestry.config.js` has a number of configurable options to modify the Tapestry bundling and server.

```js
{
  // [string] URL for your WordPress instance
  siteUrl: '',
  // [object] Container for React components
  components: {
    // [function] React components for rendering a post, page, category
    Category,
    CustomError,
    FrontPage,
    Page,
    Post
  },
  // [array] Container for route objects
  routes: [
    {
      // [string] Path to match component
      path: '',
      // path: '/path/:dynamic-path(/:optional-path)'
      
      // [function] React component to render
      component: () => {},
      // [function] import React component to render, this will code-split all JS from this route
      getComponent: () => import(),
      // [any] Source for WordPress API data, can be one of array, object or string, can also be a function that returns any of those data-types
      endpoint: 'posts',
      // endpoint: ['posts', 'pages'],
      // endpoint: { posts: 'posts', pages: 'pages' },
      
      // When used as a function it has access to params from the path
      // endpoint: (id) => `posts/${id}`,
      // endpoint: (id) => [`posts/${id}`, `pages/${id}`],
      // endpoint: (id) => { posts: `posts/${id}`, pages: `pages/${id}` }
      
      // [object] Container for route specific options
      options: {
        // [boolean] If WordPress API returns an array, allow the array response to be empty
        allowEmptyResponse: false,
        // [function] A React component to handle the surrounding document
        customDocument: ({ html, css, ids, asyncProps, assets }) => {}
      }
    }
  ],
  // [array] Paths to proxy through to the WordPress URL
  proxyPaths: [],
  // [object] Redirects from key to value e.g. { 'from': 'to' }
  redirectPaths: {},
  // [string] [uri] URL for JSON redirects file, will get picked up on server boot
  redirectsEndpoint: '',
  // [function] Runs when a route has updated and passes the API response
  onPageUpdate: (response) => {},
  // [object] Container for site options
  options: {
    // [string] 'localhost', '0.0.0.0'
    host: '',
    // [number] 3030
    port: 3030,
    // [string] Theme colour for progress bar
    progressBarColor: '',
    // [boolean] Registers https Hapi plugin
    forceHttps: false,
    // [boolean] Wordpress.com hosting configuration
    wordpressDotComHosting: false
  }
}
```
