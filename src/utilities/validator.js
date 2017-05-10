import joi from 'joi'
import { errorMessage } from './logger'

const options = {
  abortEarly: false, // we want all the errors, not just the first
  language: {
    any: {
      unknown: 'has been deprecated, refer to tapestry-wp.js.org for config options'
    }
  }
}


// define valid config schema
const schema = joi.object({
  // DEPRECATED optional number for page id or string for page name
  frontPage: joi.any().forbidden(),
  // DEPRECATED optional loaders exporting a fetch request
  loaders: joi.any().forbidden(),
  // required url
  siteUrl: joi.string().uri().required(),
  // optional string e.g. 'localhost', '0.0.0.0'
  host: joi.string(),
  // optional number e.g. 3030
  port: joi.number(),
  // optional object containing React components
  components: joi.object().keys({
    Error: joi.any().forbidden(), // DEPRECATED component
    Category: joi.func(),
    CustomError: joi.func(),
    FrontPage: joi.func(),
    Page: joi.func(),
    Post: joi.func()
  }),
  // optional array containing only route objects
  routes: joi.array().items(
    // object containing a string path and React component
    joi.object({
      component: joi.func(),
      getComponent: joi.func(),
      path: joi.string(),
      endpoint: joi.alternatives().try(joi.string(), joi.func()),
      options: joi.object().keys({
        allowEmptyResponse: joi.boolean()
      })
    })
  ),
  // optional array of proxy paths
  proxyPaths: joi.array().items(joi.string()),
  // optional object of redirects
  redirectPaths: joi.object(),
  // optional function run when routing on the client
  onPageUpdate: joi.func()
})


const logErrors = (err) => {
  // for each error message, output to console
  errorMessage(`There are some issues with your tapestry.config.js\n ${err.details.reduce((prev, item) => `${prev}\n  ${item.message}`, '')}`)
}

const validator = (config, cb) => {
  // run the users config object through joi.validate
  // joi will parse the config and match the defined schema
  joi.validate(config, schema, options, (err, value) => {
    // handle validation errors
    if (err)
      return logErrors(err)
    // run tapestry server
    cb(value)
  })
}


export default validator
