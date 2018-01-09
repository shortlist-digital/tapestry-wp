import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import styles from '../styles'

// remove protocol and host from URL string
const getRelativeUrl = url => url.replace(/^(?:\/\/|[^/]+)*\//, '/')

const FrontPage = ({ posts }) => (
  <main className={styles.wrapper}>
    <h1 className={styles.heading}>Wordpress News</h1>
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link to={getRelativeUrl(post.link)}>{post.title.rendered}</Link>
        </li>
      ))}
    </ul>
  </main>
)

FrontPage.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      link: PropTypes.string,
      title: PropTypes.shape({
        rendered: PropTypes.string
      })
    })
  ).isRequired
}

export default FrontPage
