import React, { Component, PropTypes } from 'react'
import { css } from 'glamor'

const style = ({ percent, complete }) => css({
  backgroundColor: 'red',
  height: '2px',
  left: 0,
  position: 'fixed',
  top: 0,
  opacity: complete ? 0 : 1,
  transition: complete ?
    `visibility 150ms linear 100ms,
     opacity 150ms ease-out 100ms,
     width 200ms ease-in-out` :
    `visibility 150ms,
     opacity 150ms ease-out,
     width 150ms ease-in-out`,
  width: `${percent}%`,
  visibility: complete ? 'hidden' : 'visible',
  zIndex: 10000
})

class ProgressIndicator extends Component {

  constructor() {
    super()
    this.state = {
      percent: 0,
      complete: true
    }
    this.interval = null
    this.initialPercentage = 15
    this.percentageIncrease = 5
    this.increaseInterval = 500
  }

  componentDidMount() {
    window.tapestryEmitter.on('*', type => {
      if (type === 'dataStart') this.handleDataStart()
      if (type === 'dataStop') this.handleDataStop()
    })
  }

  handleDataStart() {
    this.setState({
      percent: this.initialPercentage,
      complete: false
    })
    this.interval = setInterval(() => {
      this.setState({
        percent: this.state.percent + this.percentageIncrease
      })
    }, this.increaseInterval)
  }

  handleDataStop() {
    clearInterval(this.interval)
    this.setState({
      percent: 100,
      complete: true
    })
    setTimeout(() => {
      this.setState({
        percent: 0
      })
    }, this.increaseInterval)
  }

  render() {
    return (
      <div>
        <div className={style(this.state)} />
        {this.props.children}
      </div>
    )
  }
}

ProgressIndicator.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default ProgressIndicator
