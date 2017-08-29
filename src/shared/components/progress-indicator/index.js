import React, { Component } from 'react'
import idx from 'idx'
import propTypes from './prop-types'

// reduce percentageIncrease if its a slow request
const increasePercentage = (prevState) => ({
  percent: prevState.percent + prevState.percentageIncrease,
  percentageIncrease: prevState.percent >= 60 ? 2 : 3
})
// initial percentage value
const minPercentage = () => ({
  percent: 15,
  visible: true
})
// maximum value
const maxPercentage = () => ({
  percent: 100,
  visible: false
})
// reset any values that could update
const resetPercentage = () => ({
  percent: 0,
  percentageIncrease: 3
})

class ProgressIndicator extends Component {

  constructor(props) {
    super(props)
    this.state = {
      percent: 0,
      percentageIncrease: 3,
      visible: false
    }
    // configurable options
    this.progressBarColor = '#00ffcb'
    this.resetDelay = 800
    this.increaseInterval = 400
    // bindin this yo
    this.updateWidth = this.updateWidth.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.reset = this.reset.bind(this)
    // define all events and handlers emitted throughout app
    this.globalEvents = [{
      type: 'dataStart',
      handler: this.start
    }, {
      type: 'dataStop',
      handler: this.stop
    }, {
      type: 'dataReset',
      handler: this.reset
    }]
    // set color if declared
    if (idx(props, _ => _.route.config.options.progressBarColor)) {
      this.progressBarColor = props.route.config.options.progressBarColor
    }
  }

  componentDidMount() {
    // bind all required events for loading state
    this.globalEvents.forEach(
      event => window.tapestryEmitter.on(
        event.type, event.handler
      )
    )
  }
  componentWillUnmount() {
    // this lifecycle method doesn't ever get called
    // but no harm in adding it right?
    this.globalEvents.forEach(
      event => window.tapestryEmitter.off(
        event.type, event.handler
      )
    )
  }

  start() {
    // need to remove previous interval here
    // as it _might_ be called multiple times
    window.clearInterval(this.interval)
    // set to initialPercentage then incrementally update width
    this.setState(
      minPercentage,
      () => {
        this.interval = window.setInterval(
          this.updateWidth,
          this.increaseInterval
        )
      }
    )
  }
  reset() {
    // stop updating loader
    window.clearInterval(this.interval)
    // kick off updating loader once reset
    this.setState(
      resetPercentage,
      this.start
    )
  }
  stop() {
    // stop updating loader
    window.clearInterval(this.interval)
    // move to 100% and reset when complete
    this.setState(
      maxPercentage,
      () => {
        setTimeout(() => { this.setState(resetPercentage) }, this.resetDelay)
      }
    )
  }

  updateWidth() {
    // incrementally embiggen loader
    this.setState(increasePercentage)
    // stop updating loader if its a super slow request
    if (this.state.percent >= 90) {
      window.clearInterval(this.interval)
    }
  }

  render() {
    return (
      <div>
        <div
          style={{
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
          }}
        />
        {this.props.children}
      </div>
    )
  }
}

ProgressIndicator.propTypes = propTypes

export default ProgressIndicator
