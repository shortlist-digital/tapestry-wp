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
