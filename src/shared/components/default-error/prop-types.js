import PropTypes from 'prop-types'

export const defaultProps = {
  message: 'Application Error'
}

export default {
  message: PropTypes.string,
  code: PropTypes.number,
  children: PropTypes.node
}
