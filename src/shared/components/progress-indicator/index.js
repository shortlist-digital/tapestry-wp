import React, { Component } from 'react'
import idx from 'idx'

import propTypes from './prop-types'

class ProgressIndicator extends Component {

  constructor(props) {
    super(props)
    this.state = {
      percent: 0,
      visible: false
    }
    // configurable options
    this.progressBarColor = '#00ffcb'
    this.initialPercentage = 15
    this.percentageIncrease = 3
    this.increaseInterval = 400
    // set color if declared
    if (idx(props, _ => _.route.config.options.progressBarColor)) {
      this.progressBarColor = props.route.config.options.progressBarColor
    }
  }

  componentDidMount() {
    // tapestryEmitter is fired from fetch-route-data
    if (!window.tapestryEmitter) return
    window.tapestryEmitter.on('*', type => {
      if (type === 'dataStart') {
        this.handleDataStart()
      }
      if (type === 'dataStop') {
        this.handleDataStop()
      }
    })
  }

  handleDataStart() {
    this.setState({
      percent: this.initialPercentage,
      visible: true
    })
    // update width repeatedly
    this.interval = setInterval(
      this.updateWidth.bind(this),
      this.increaseInterval
    )
  }
  handleDataStop() {
    // no more updating
    clearInterval(this.interval)
    this.setState({
      percent: 100,
      visible: false
    })
    // reset after opacity animated out
    setTimeout(() => {
      this.setState({ percent: 0 })
      this.percentageIncrease = 3
    }, 800)
  }

  updateWidth() {
    // handle a slow request
    if (this.state.percent >= 60) {
      this.percentageIncrease = 2
    }
    // handle a super slow request
    if (this.state.percent >= 90) {
      clearInterval(this.interval)
    }
    this.setState({
      percent: this.state.percent + this.percentageIncrease
    })
  }

  render() {

    const style = {
      backgroundColor: this.progressBarColor,
      height: '3px',
      left: 0,
      opacity: this.state.visible ? 1 : 0,
      position: 'fixed',
      top: 0,
      transition: this.state.visible ?
        `opacity 0ms linear 0ms, width 400ms ease` :
        `opacity 300ms ease 300ms, width 300ms ease`,
      width: `${this.state.percent}%`,
      zIndex: 10000
    }

    return (
      <div>
        <div style={style} />
        {this.props.children}
      </div>
    )
  }
}

ProgressIndicator.propTypes = propTypes

export default ProgressIndicator
