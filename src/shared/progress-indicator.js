import React, { Component } from 'react'
import Progress from 'react-progress'

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

  handleChange(type, event) {
    if (type == 'dataStop') {
      clearInterval(this.interval)
      this.setState({percent: 100})
      setTimeout(() => {
        this.setState({percent: 0})
      }, 1000)
    }
    if (type == 'dataStart') {
      this.interval = setInterval(() => {
        console.log('Ticking')
        let updateState = this.state.percent + 10
        this.setState({percent: updateState })
      }, 500)
    }
  }

  render() {
    return (
      <div>
        <Progress percent={this.state.percent} height={2} speed={0.1} style={{zIndex: 999999999}} />
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
