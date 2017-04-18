import React, { Component } from 'react'
import PropTypes from 'prop-types'
import has from 'lodash/has'

class ProgressIndicator extends Component {

  constructor() {
    super()
    this.state = {
      percent: 0,
      complete: true
    }
    this.style = config => ({
      backgroundColor: has(config, 'option.progressBarColor') ? `#${config.options.progressBarColor}` : '#50e3c2',
      height: '2px',
      left: 0,
      position: 'fixed',
      top: 0,
      zIndex: 10000
    })
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
    const { complete, percent } = this.state
    return (
      <div>
        <div
          style={{
            ...this.style(this.props.route.config),
            opacity: complete ? 0 : 1,
            transition: complete ?
              `visibility 150ms linear 100ms,
              opacity 150ms ease-out 100ms,
              width 200ms ease-in-out` :
              `visibility 150ms,
              opacity 150ms ease-out,
              width 150ms ease-in-out`,
            width: `${percent}%`,
            visibility: complete ? 'hidden' : 'visible'
          }}
        />
        {this.props.children}
      </div>
    )
  }
}

ProgressIndicator.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  route: PropTypes.shape({
    config: PropTypes.object
  })
}

export default ProgressIndicator
