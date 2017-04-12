import React from 'react'
import { css } from 'glamor'

const DefaultError = () =>
  <section
    className={css({
      backgroundColor: '#f9f9f9',
      display: 'flex',
      height: '100vh',
      width: '100vw'
    })}
  >
    <h1 className={css({
      color: '#e5e5e5',
      fontFamily: 'Helvetica',
      fontSize: '14px',
      fontWeight: 'bold',
      margin: 'auto'
    })}>
      Tapestry Error Page
    </h1>
  </section>

export default DefaultError
