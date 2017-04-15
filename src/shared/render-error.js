import React from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'
import DefaultError from './default-error'
import MissingView from './missing-view'

const RenderError = ({ config }) => {

  // render custom error or default if custom error not declared
  let ErrorView = has(config, 'components.CustomError') ?
    config.components.CustomError :
    DefaultError
  // always render missing view in development
  if (__DEV__) ErrorView = MissingView
  // return one of the error views
  return <ErrorView />
}

RenderError.propTypes = {
  config: PropTypes.object
}

export default RenderError
