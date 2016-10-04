import React from 'react'
import { css } from 'aphrodite'
import t from '../styles/typography'

const Image = ({image, caption}) =>
  <div>
    <img
      src={image.url}
      style={{
        maxWidth:'100%',
        width: '100%',
        marginBottom: '25px'
      }}
    />
    <small
      dangerouslySetInnerHTML={{__html:caption}}
      className={css(t.base, t.lhCopy)}
    >
    </small>
  </div>

export default Image
