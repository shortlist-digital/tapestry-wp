import joi from 'joi'
import { error } from './logger'


// define valid config schema
const schema = joi.object({
  // required url
  siteUrl: joi.string().uri().required(),
  // object containing React components
  components: joi.object().keys({
    Category: joi.func(),
    Error: joi.func(),
    FrontPage: joi.func(),
    Page: joi.func(),
    Post: joi.func()
  }),
  // array only containing route objects
  routes: joi.array().items(
    // object containing a string path and React component
    joi.object({
      path: joi.string(),
      component: joi.func()
    })
  )
})


const logErrors = (err) => {
  // for each error message, output to console
  error(`There are some issues with your tapestry.config.js\n ${err.details.reduce((prev, item) => `${prev}\n  ${item.message}`, '')}`)
}

const validator = (config, cb) => {
  // run the users config object through joi.validate
  // joi will parse the config and match the defined schema
  joi.validate(config, schema, {
    abortEarly: false // we want all the errors, not just the first
  }, (err, value) => {
    // handle validation errors
    if (err)
      return logErrors(err)
    // run tapestry server
    cb(value)
  })
}


export default validator
