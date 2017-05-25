import React, { Component } from 'react'
import PropTypes from 'prop-types'
import idx from 'idx'

class ProgressIndicator extends Component {

  constructor() {
    super()
    this.state = {
      percent: 0,
      visible: false
    }
    this.defaultStyle = {
      height: '2px',
      left: 0,
      position: 'fixed',
      top: 0,
      zIndex: 10000
    }
    this.customStyle = config => ({
      backgroundColor: idx(config, _ => _.options.progressBarColor) || '#00ffcb'
    })
    this.interval = null
    this.initialPercentage = 15
    this.percentageIncrease = 3
    this.increaseInterval = 400
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
      visible: true
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
      visible: false
    })
    setTimeout(() => {
      this.setState({
        percent: 0
      })
    }, 600)
  }

  render() {
    const { visible, percent } = this.state
    return (
      <div>
        <div
          style={{
            ...this.defaultStyle,
            ...this.customStyle(this.props.route.config),
            opacity: visible ? 1 : 0,
            transition: visible ?
             `opacity 0ms linear 0ms,
              width 400ms ease` :
             `opacity 300ms ease 300ms,
              width 300ms ease`,
            width: `${percent}%`
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
