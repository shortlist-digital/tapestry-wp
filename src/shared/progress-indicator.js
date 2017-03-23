import React  from 'react'
import Progress from 'react-progress'

const ProgressIndicator = (props) =>
  <div>
    <Progress percent={60} style={{zIndex: 999999999}} />
    {/* props.children is essentially the <Router /> component */}
    {props.children || <h1>No Routes defined!</h1>}
  </div>

ProgressIndicator.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ])
}

export default ProgressIndicator
