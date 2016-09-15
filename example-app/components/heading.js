import React from 'react'

const Heading = ({text}) =>
  <h3 dangerouslySetInnerHTML={{__html: text}}></h3>

export default Heading
