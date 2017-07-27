import PropTypes from 'prop-types'

export default {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  route: PropTypes.shape({
    config: PropTypes.object
  })
}
