import React from 'react'
// import has from 'lodash/has'
// import MissingView from '../../shared/missing-view'

const RenderError = (config) => {

  console.log(config)

  return <p>Error</p>

  // const ErrorView = has(components, 'CustomError') ?
  //   components.CustomError :
  //   MissingView
  //
  // return <ErrorView />
}

export default RenderError
