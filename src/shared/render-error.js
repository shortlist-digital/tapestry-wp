import React from 'react'
import idx from 'idx'
import PropTypes from 'prop-types'
import DefaultError from './components/default-error'

const RenderError = ({ config, response, missing }) => {
  // render custom error or default if custom error not declared
  let ErrorView = idx(config, _ => _.components.CustomError) ?
    config.components.CustomError :
    DefaultError
  // render missing component only in DEV
  if (__DEV__ && missing) {
    ErrorView = require('./components/missing-view')
    response = {
      message: 'Missing component'
    }
  }
  // return one of the error views
  return <ErrorView {...response} />
}

RenderError.propTypes = {
  config: PropTypes.object,
  missing: PropTypes.bool,
  response: PropTypes.object
}

export default RenderError
