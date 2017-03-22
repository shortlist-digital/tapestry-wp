import React  from 'react'
import Progress from 'react-progress'

const ProgressIndicator = (props) =>
  <div>
    <Progress percent={60} stlye={{zIndex: 999999999}} />
    {props.children}
  </div>

ProgressIndicator.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
}

export default ProgressIndicator
