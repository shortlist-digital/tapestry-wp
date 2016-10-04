import React from 'react'
import Helmet from 'react-helmet'
import Image from '../image'
import Widgets from '../widgets'
import ObjectInspector from 'react-object-inspector'
import { StyleSheet, css } from 'aphrodite/no-important'
import t from '../../styles/typography'

const styles = StyleSheet.create({
  author: {
    display: 'block',
    marginBottom: '10px'
  }
})


const Post = ({post}) =>
  <div>
    <Helmet
      title={post.title.rendered}
      meta={[
        {'og:image': post._embedded['wp:featuredmedia'][0].source_url}
      ]}
    />
    <h1 className={css(t.base, t.bold, t.f1)}>
      {post.title.rendered}
    </h1>
    <h2 className={css(t.base, t.f2)}>
      {post.acf.sell}
    </h2>
    <hr />
    <small className={css(styles.author, t.base, t.f5)}>
      By {post._embedded.author[0].name}
    </small>
    <Image
      image={{
        url: post._embedded['wp:featuredmedia'][0].source_url
      }}
    />
    <Widgets {...post.acf} />
    <ObjectInspector data={post} />
  </div>

export default Post
