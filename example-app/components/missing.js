import React from 'react'
import ObjectInspector from 'react-object-inspector'

let Missing = (props) =>
  <div>
    <hr />
    <h3>Uh oh... Widget Missing</h3>
    <ObjectInspector
      data={props}
      initialExpandedPaths={['root']} />
    <br />
    <hr />
  </div>

export default Missing
