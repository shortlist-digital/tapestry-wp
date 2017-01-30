import React, { PropTypes } from 'react'
import ObjectInspector from 'react-object-inspector'

const Page = props =>
  <section>
    <h1>{props.title.rendered}</h1>
    <ObjectInspector
      data={props}
      initialExpandedPaths={['root']} />
  </section>

Page.propTypes = {
  title: PropTypes.shape({
    rendered: PropTypes.string.isRequired
  }).isRequired
}

export default Page
