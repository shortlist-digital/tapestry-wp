import React from 'react'
import propTypes from './prop-types'

const DefaultProgressIndicator = ({ percent, visible }) => (
  <div
    style={{
      backgroundColor: '#00ffcb',
      height: '3px',
      left: 0,
      opacity: visible ? 1 : 0,
      position: 'fixed',
      top: 0,
      transition: visible
        ? `opacity 0ms linear 0ms, width 400ms ease`
        : `opacity 300ms ease 300ms, width 300ms ease`,
      width: `${percent}%`,
      zIndex: 10000
    }}
  />
)

DefaultProgressIndicator.propTypes = propTypes

export default DefaultProgressIndicator
