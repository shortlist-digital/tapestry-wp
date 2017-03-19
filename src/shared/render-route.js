import React, { PropTypes } from 'react'
import { has } from 'lodash'
import MissingView from './missing-view'

const routeRender = ({ config, id }, data) => {
  // get custom components from user config
  const Component = config[id]
  const Error = config.Error || MissingView
  // check data exists and isnt a server errored response
  if (!data || has(data, 'data.status'))
    return <Error />
  // check component exists before rendering
  if (Component)
    return <Component {...data} />
  // otherwise render that lovely data in a MissingView
  return <MissingView {...data} />
}

routeRender.propTypes = {
  config: PropTypes.object,
  id: PropTypes.string
}

export default routeRender
