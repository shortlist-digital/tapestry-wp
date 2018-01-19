import joi from 'joi'
const log = require('./logger').log

const options = {
  abortEarly: false, // we want all the errors, not just the first
  language: {
    any: {
      unknown:
        'has been deprecated, refer to tapestry-wp.js.org for config options'
    }
  }
}

// define valid config schema
const schema = joi.object({
  // DEPRECATED
  frontPage: joi.any().forbidden(),
  loaders: joi.any().forbidden(),
  // required url
  siteUrl: joi
    .string()
    .uri()
    .required(),
  // optional object containing React components
  components: joi.object().keys({
    Error: joi.any().forbidden(), // DEPRECATED
    Category: joi.func(),
    CustomError: joi.func(),
    ProgressIndicator: joi.func().allow(null),
    FrontPage: joi.func(),
    Page: joi.func(),
    Post: joi.func()
  }),
  // optional array containing only route objects
  routes: joi.array().items(
    // object containing a string path and React component
    joi.object({
      component: joi.func(),
      endpoint: [joi.string(), joi.func(), joi.object(), joi.array()],
      getComponent: joi.func(),
      options: joi.object().keys({
        allowEmptyResponse: joi.boolean(),
        customDocument: joi.func()
      }),
      path: joi.string().required()
    })
  ),
  // optional array of proxy paths e.g. ['path', 'another/path']
  proxyPaths: joi.array().items(joi.string()),
  // optional object of redirects e.g. { 'path': 'to-redirect' }
  redirectPaths: joi.object().pattern(/.*/, joi.string()),
  // optional endpoint to load redirects.json from
  redirectsEndpoint: joi.string().uri(),
  // optional function run when routing on the client
  onPageUpdate: joi.func(),
  // misc options
  options: joi.object().keys({
    // string e.g. 'localhost', '0.0.0.0'
    host: joi.string(),
    // number e.g. 3030
    port: joi.number(),
    // registers https Hapi plugin
    forceHttps: joi.boolean(),
    // Wordpress.com hosting configuration
    wordpressDotComHosting: joi.boolean()
  })
})

const logErrors = err => {
  // for each error message, output to console
  log.error(
    `There are some issues with your tapestry.config.js\n ${err.details.reduce(
      (prev, item) => `${prev}\n  ${item.message}`,
      ''
    )}`
  )
  log.debug('tapestry.config.js error', err.details)
}

const validator = (config, cb) => {
  // run the users config object through joi.validate
  // joi will parse the config and match the defined schema
  joi.validate(config, schema, options, (err, value) => {
    // handle validation errors
    if (err) return logErrors(err)
    // run tapestry server
    cb(value)
  })
}

export default validator
