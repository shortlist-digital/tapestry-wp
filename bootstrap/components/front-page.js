import React, { PropTypes } from 'react'
import { Link } from 'react-router'

// remove protocol and host from URL string
const getRelativeUrl = url =>
  url.replace(/^(?:\/\/|[^\/]+)*\//, '/')

const FrontPage = ({ posts }) =>
  <main>
    <ul>
      {
        posts.map(post => (
          <li key={post.id}>
            <Link to={getRelativeUrl(post.link)}>
              {post.title.rendered}
            </Link>
          </li>
        ))
      }
    </ul>
  </main>

FrontPage.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      link: PropTypes.string,
      title: PropTypes.shape({
        rendered: PropTypes.string
      })
    })
  ).isRequired
}

export default FrontPage
