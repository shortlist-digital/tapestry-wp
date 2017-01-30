import React, { PropTypes } from 'react'
import ObjectInspector from 'react-object-inspector'

const Post = props =>
  <section>
    <h1>{props.title.rendered}</h1>
    <ObjectInspector
      data={props}
      initialExpandedPaths={['root']} />
  </section>

Post.propTypes = {
  title: PropTypes.shape({
    rendered: PropTypes.string.isRequired
  }).isRequired
}

export default Post
