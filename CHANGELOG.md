### v1.3.0
* Changed output directory for transpiled project to `.tapestry`
* Changed output directory for the client bundle to `_scripts` to avoid a clashe with the `public` directory for project specific files
* Added relevant plugins/settings to `webpack.config` to output a much smaller build when building for production
* Upgraded `webpack` to v2, `webpack.config` updated to match new schema
* Reverted the CLI to `commander` and split out the commands for ease of development
