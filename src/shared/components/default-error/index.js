import React from 'react'
import propTypes, { defaultProps } from './prop-types'

const DefaultError = ({
  message,
  code,
  children
}) =>
  <section style={{
    backgroundColor: '#f9f9f9',
    fontFamily: 'Helvetica, sans-serif',
    minHeight: '100vh',
    padding: '80px',
    width: '100vw'
  }}>
    <svg style={{ marginBottom: '20px' }} width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path style={{ fill: '#C0C0C0' }} d="M55.76 12.82H60v.15h-4.24v-.15zM0 46.82h4.24v-.16H0v.15zm4.24 0H0v-.16h4.24v.14zm48-37.42H2.38C1.2 9.4.28 8.44.28 7.26c0-1.2.93-2.15 2.1-2.15h49.86c4.26 0 7.72 3.5 7.76 7.8-.04 4.3-3.5 7.8-7.77 7.8H8.03c-1.93 0-3.5 1.6-3.53 3.5.03 2 1.6 3.6 3.52 3.6h44.2c4.25 0 7.7 3.5 7.76 7.8-.06 4.3-3.52 7.76-7.77 7.76H7.8c-1.92 0-3.48 1.55-3.52 3.5.04 1.93 1.6 3.5 3.52 3.5h50.1c1.17 0 2.12.95 2.12 2.13 0 1.2-.96 2.14-2.13 2.14H7.7c-4.27 0-7.73-3.47-7.77-7.8C0 42.5 3.45 39 7.73 39H52.2c1.92 0 3.48-1.54 3.54-3.47-.06-1.93-1.6-3.5-3.53-3.5H8.1c-4.3 0-7.75-3.46-7.8-7.8.04-4.3 3.5-7.8 7.78-7.8h44.2c1.93 0 3.5-1.56 3.53-3.5 0-1.93-1.6-3.5-3.5-3.5z" />
      <path style={{ fill: '#E5E5E5' }} d="M9.53 16.42V6.45c0-.96.7-1.74 1.6-1.74h.3c.4 0 .77.2 1.05.5h4.3C16.2 2.5 14.03.5 11.43.5h-.32c-3 0-5.4 2.7-5.4 6v10.3s.7-.26 1.7-.37h2.2zm14.82 0v-10c0-.97.72-1.75 1.6-1.75h.3c.4 0 .78.17 1.05.43.5 0 3.75-.04 4.3 0-.55-2.7-2.73-4.68-5.34-4.68h-.32c-3.02 0-5.47 2.68-5.47 5.98v10l3.88.02zm14.83.02v-10c0-.95.7-1.73 1.58-1.73h.33c.4 0 .7.2 1 .5h4.3C45.8 2.5 43.6.5 41 .5h-.34c-3 0-5.47 2.7-5.47 6v9.96l3.9.02zm-18.52 26.8v9.97c0 1-.72 1.8-1.6 1.8h-.3c-.4 0-.78-.1-1.05-.4-.4 0-3.7.08-4.3 0 .6 2.7 2.8 4.7 5.4 4.7h.3c3 0 5.5-2.7 5.5-6v-10h-3.9zm14.82 0v9.97c0 1-.7 1.8-1.6 1.8h-.3c-.4 0-.77-.1-1.05-.4-.5 0-3.74.08-4.3 0 .56 2.7 2.73 4.7 5.34 4.7h.33c3 0 5.46-2.7 5.46-6v-10h-3.88zm14.82-.02v9.97c0 .9-.7 1.7-1.58 1.7h-.33c-.4 0-.8-.2-1.1-.4H43c.57 2.6 2.75 4.6 5.35 4.6h.32c3 0 5.46-2.7 5.46-6V42.9s-.86.26-1.46.26c-1.36.1-2.43 0-2.43 0z"/>
      <path style={{ fill: '#E5E5E5' }} d="M7.6 20.67h1.93v18.3H7.4c-.9.04-1.75.3-1.75.3V21.6s.86-.95 1.94-.95zm5.46-11.3h3.88V27.7h-3.88V9.38zm14.82.03h3.88v18.3h-3.88V9.4zm14.83 0h3.9v18.3h-3.9V9.4zm7.5 11.3h2.4c.8 0 1.5-.22 1.5-.22v18s-.4.44-1.73.5H50.2v-18.3zM13.1 31.94H17v18.3h-3.9v-18.3zm14.8.06h3.88v18.2H27.9V32zm14.83-.04h3.9v18.3h-3.9v-18.3zm-22.2-11.3h3.9v18.3h-3.9v-18.3zm14.83 0h3.88v18.3h-3.9v-18.3zM7.46 43.24H9.5V57.6c0 1.07-.87 1.95-1.94 1.95-1.08 0-1.95-.88-1.95-1.96V43.9s.5-.62 1.8-.73zM52.2 16.36h-2.1V2.14c0-1.08.87-1.96 1.94-1.96 1.07 0 1.94.88 1.94 1.96V15.9s-.72.47-1.8.47z"/>
    </svg>
    {
      code &&
      <p style={{
        color: '#c0c0c0',
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '10px',
        marginTop: '20px'
      }}>
        {code}
      </p>
    }
    <h1 style={{
      color: '#c0c0c0',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '40px'
    }}>
      {message}
    </h1>
    {children}
  </section>

DefaultError.defaultProps = defaultProps
DefaultError.propTypes = propTypes

export default DefaultError
