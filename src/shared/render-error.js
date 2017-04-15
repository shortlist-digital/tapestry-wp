import React from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'
import DefaultError from './default-error'
import MissingView from './missing-view'

const RenderError = (props) => {
  // render custom error or default if custom error not declared
  let ErrorView = has(props.config, 'components.CustomError') ?
    () => props.config.components.CustomError({ status: '404', message: 'Not found' }) :
    () => DefaultError({ status: '404', message: 'Not found' })
  // always render missing view in development
  if (__DEV__) {
    ErrorView = () => MissingView(props.response)
  }
  // return one of the error views
  return <ErrorView />
}

RenderError.propTypes = {
  config: PropTypes.object,
  response: PropTypes.object
}

export default RenderError
