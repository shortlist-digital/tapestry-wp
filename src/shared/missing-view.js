import React from 'react'
import PropTypes from 'prop-types'
import ObjectInspector from 'react-object-inspector'
import DefaultError from './default-error'

const MissingView = (data) =>
  <DefaultError message="Missing Component">
    {
      data &&
        <ObjectInspector
          data={data}
          initialExpandedPaths={['root']}
        />
    }
  </DefaultError>

MissingView.propTypes = {
  data: PropTypes.object
}
export default MissingView
