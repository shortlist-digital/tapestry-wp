import React from 'react'
import ObjectInspector from 'react-object-inspector'

const MissingView = (props) =>
  <section>
    <h1>Missing component</h1>
    <ObjectInspector
      data={props}
      initialExpandedPaths={['root']} />
  </section>

export default MissingView
