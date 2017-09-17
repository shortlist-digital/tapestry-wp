#### 3.0.0-5

* Add fetcher shared file to allow for connection pooling on the server

#### 3.0.0-1
* Configurable Redis Cache 

#### 3.0.0-0
* Cluster management

#### 2.3.1
* Redirects are case insensitive

#### 2.3.0
* Add CACHE_MAX_ITEM_COUNT var to increase cache size

#### 2.2.0
* Add cachebust param to redirects json request

#### 2.1.0
* Add `tapestry hot` command for live reloading of client

#### 2.0.0
* Homegenise how `ENV` variables are used
* Add `wordpress.com` site support

#### 2.0.0-26
* Rewrite of how redirects are handled - improves boot time with a large number of redirects

#### 2.0.0-25
* Fixed missing rendering of Hapi redirect errors

#### 2.0.0-24
* Caching HTML response by pathname instead of entire path with query/hash

#### 2.0.0-23
* Remove `cache-control` header from WordPress preview link

#### 2.0.0-22
* Added `CACHE_CONTROL_MAX_AGE` env var

#### 2.0.0-21
* Exposed API response data to `onPageUpdate` function
* Fixed issue when user clicks on multiple links before the previous page had finished loading
* Removed `async-props` from vendor bundle

#### 2.0.0-20
* Added `core-js/modules/es6.symbol` polyfill to main bundle
* Updated Hapi to `~16.5.2`

#### 2.0.0-19
* Internal Hapi server now uses `301` redirects instead of `308` in order to support IE10/11

#### 2.0.0-18
* Pinned Glamor version exactly to prevent regression around `attr()`

#### 2.0.0-17
* Upgraded to webpack `3.4.0`
* Rewrote cache logs, updated some `debug` calls to `silly`
* Fixed homepage caching that was caused by stripping trailing slash from routes
* Implemented `redirectsEndpoint` functionality, add a path to a `redirects.json` and Hapi will fetch the file and set all redirects

#### 2.0.0-16
* Added `forceHttps` option to register `hapi-require-https` plugin
* Updated redirect to retain `request.url.search`
* Added year long cache for static assets served from `_scripts`
* Removed case sensitivity from Hapi routes
* Fixed static routes (without an endpoint) returning a `404` when they should return `200`

#### 2.0.0-15
* Stripping trailing slash from routes

#### 2.0.0-14
* Removed `babel` utility build step, all files are now `node 6` compatible
* Implemented `http-status` lib for correct status code/messages
* Improved log consistency
* Added ability to read redirects from a `redirects.json` file in the root of the project
* Added default security option to Hapi https://hapijs.com/api#route-configuration
* Returning response data to `customError` component when available
* Normalised API response and error handling between client and server
* Updated error view to show `Missing` only when the component is missing, if `CustomError` is declared then that will always show
* Removed `tapestry-log.log` output from Winston as the implementation was buggy and unfinished
* Improved how `progressIndicator` handles long loading times, increased height to `3px`
