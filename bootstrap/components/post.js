import React, { PropTypes } from 'react'

const Post = props =>
  <main>
    <h1>
      {props.title.rendered}
    </h1>
    <p>{new Date(props.date).toJSON().slice(0,10)}</p>
    <div dangerouslySetInnerHTML={{
      __html: props.content.rendered
    }} />
  </main>

Post.propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.shape({
    rendered: PropTypes.string.isRequired
  }).isRequired,
  content: PropTypes.shape({
    rendered: PropTypes.string.isRequired
  }).isRequired
}

export default Post
