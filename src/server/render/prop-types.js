import PropTypes from 'prop-types'

export default {
  markup: PropTypes.shape({
    html: PropTypes.string.isRequired,
    ids: PropTypes.array.isRequired,
    css: PropTypes.string.isRequired
  }).isRequired,
  head: PropTypes.object.isRequired,
  asyncProps: PropTypes.shape({
    propsArray: PropTypes.array
  }),
  assets: PropTypes.object
}
