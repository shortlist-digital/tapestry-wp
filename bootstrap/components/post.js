import React, { PropTypes } from 'react'
import styles from '../styles'

const Post = props =>
  <main className={styles.wrapper}>
    <h1 className={styles.heading}>
      {decodeURIComponent(props.title.rendered)}
    </h1>
    <p className={styles.date}>
      {`Published — ${new Date(props.date).toJSON().slice(0, 10)}`}
    </p>
    <div
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: props.content.rendered }}
    />
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
