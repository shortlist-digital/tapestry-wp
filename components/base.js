import React, { PropTypes } from 'react'

const Base = props =>
  <section>
    {props.children}
  </section>

Base.propTypes = {
  children: PropTypes.element.isRequired
}

export default Base
