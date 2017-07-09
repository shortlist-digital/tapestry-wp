import React from 'react'
import PropTypes from 'prop-types'
import ObjectInspector from 'react-object-inspector'
import DefaultError from './default-error'

const MissingView = (response) =>
  <DefaultError {...response}>
    {
      response &&
      <ObjectInspector
        data={response}
        initialExpandedPaths={['root']}
      />
    }
  </DefaultError>

MissingView.propTypes = {
  response: PropTypes.object
}
export default MissingView
