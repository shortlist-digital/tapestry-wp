import React, { Component } from 'react'
import { css } from 'glamor'

const style = width => css({
  backgroundColor: 'red',
  height: '2px',
  left: 0,
  position: 'fixed',
  top: 0,
  transition: 'width 50ms ease-out',
  width: width ? width : '100%',
  zIndex: 10000
})

class ProgressIndicator extends Component {

  constructor() {
    super()
    this.state = {
      percent: 0
    }
    this.handleChange = this.handleChange.bind(this)
    this.interval = null
  }

  componentDidMount() {
    window.tapestryEmitter.on('*', this.handleChange)
  }

  handleChange(type) {
    if (type == 'dataStop') {
      clearInterval(this.interval)
      this.setState({percent: 100})
      setTimeout(() => {
        this.setState({percent: 0})
      }, 1000)
    }
    if (type == 'dataStart') {
      let updateState = this.state.percent + 10
      this.setState({percent: updateState })
      this.interval = setInterval(() => {
        updateState = this.state.percent + 10
        this.setState({percent: updateState })
      }, 500)
    }
  }

  render() {
    return (
      <div>
        <div className={style(this.state.percent)}></div>
        {/* <Progress percent={this.state.percent} height={2} speed={0.1} style={{zIndex: 999999999}} /> */}
        {/* props.children is essentially the <Router /> component */}
        {this.props.children || <h1>No Routes defined!</h1>}
      </div>
    )
  }
}


ProgressIndicator.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
}

export default ProgressIndicator
