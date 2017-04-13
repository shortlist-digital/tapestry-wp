import React from 'react'
import ObjectInspector from 'react-object-inspector'
import DefaultError from './default-error'

const MissingView = (props) =>
  <DefaultError message="Missing Component">
    <ObjectInspector
      data={props}
      initialExpandedPaths={['root']} />
  </DefaultError>

export default MissingView
