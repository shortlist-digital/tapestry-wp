import React from 'react'
import { css } from 'aphrodite'
import t from '../styles/typography'

const Paragraph = ({paragraph}) =>
  <div
    dangerouslySetInnerHTML={{__html: paragraph}}
    className={css(t.base, t.lhCopy)}
  ></div>

export default Paragraph
