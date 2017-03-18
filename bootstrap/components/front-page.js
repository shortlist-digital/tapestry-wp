import React from 'react'
import { Link } from 'react-router'

const FrontPage = props =>
  <main>
    <ul>
      {
        Object
        .keys(props)
        .map(key => {
          const post = props[key]
          const date = new Date(post.date)
          const slug = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${post.slug}`
          return (
            <li key={key}>
              <Link to={slug}>
                {post.title.rendered}
              </Link>
            </li>
          )
        })
      }
    </ul>
  </main>

export default FrontPage
