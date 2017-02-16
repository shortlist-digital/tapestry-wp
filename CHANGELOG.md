### v1.5.4
* Added executable permissions to `tapestry-init` command

### v1.4.7
* Removed `lodash` `once` dependency

### v1.4.6
* `tapestry dev` now listens for file changes and re-compiles the client, the server re-requires the latest project component tree and will update on page-reload.

### v1.4.5
* Improved `tapestry build` script removing the `exec` call and replacing it with the `babel` Node API 

### v1.4.4
* Fixed a `tapestry build` incorrect directory issue when deploying on Heroku

### v1.4.3
* Fixed missing dependency in `package.json`
* Fixed inexplicit `babel` reference in `tapestry build` command
* Added `npm` version badge to `README.md`

### v1.4.1
* Added a set of basic server tests to check responses, proxies and output HTML
* Renamed the `Home` component to `FrontPage` to increase the Wordpressy-ness
* Fixed the `engines` version range in `package.json`
* Added a `tapestry init` command to bootstrap a simple Tapestry project. This includes a `tapestry.config.js` and the `Post` and `Page` components

### v1.4.0
* Changed configuration filename to `tapestry.config.js`
* Incorporated a `logger.js` and normalised logging through the server
* Improved and normalised error handling throughout the app

### v1.3.0
* Changed output directory for transpiled project to `.tapestry`
* Changed output directory for the client bundle to `_scripts` to avoid a clash with the `public` directory for project specific files
* Added relevant plugins/settings to `webpack.config` to output a much smaller build when building for production
* Upgraded `webpack` to v2, `webpack.config` updated to match new schema
* Reverted the CLI to `commander` and split out the commands for ease of development

### < v1.3.0
* Switched the glamor method to renderStaticOptimized
* Added `engines` to `package.json` for deployment environments
* Outputting `stats.json` to project root
* Fix undeclared custom-loaders error
* Added location-origin polyfill
* Added `onPageUpdate` method that fires on React Routers `onUpdate` method
