import React from 'react'
import PropTypes from 'prop-types'
import styles from '../styles'
import { Link } from 'react-router'

const Post = props => {
  const data = props.posts[0]
  return (
    <main className={styles.wrapper}>
      <Link to='/'>
        <h1 className={styles.heading}>Home</h1>
      </Link>
      <h1 className={styles.heading}>
        {decodeURIComponent(data.title.rendered)}
      </h1>
      <p className={styles.date}>
        {`Published — ${new Date(data.date).toJSON().slice(0, 10)}`}
      </p>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: data.content.rendered }}
      />
    </main>
  )
}

Post.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.shape({
        rendered: PropTypes.string.isRequired
      }).isRequired,
      content: PropTypes.shape({
        rendered: PropTypes.string.isRequired
      }).isRequired
    })
  )
}

export default Post
