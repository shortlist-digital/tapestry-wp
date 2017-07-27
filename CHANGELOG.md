#### 2.0.0-19
* Internal Hapi server now uses 301 redirects instead of 308 in order to support IE10/11

#### 2.0.0-18
* Pinned Glamor version exactly to prevent regression around `attr()`

#### 2.0.0-17
* Upgraded to webpack 3.4.0
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
