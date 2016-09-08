import React from 'react'

let Heading = ({text}) =>
  <h3 dangerouslySetInnerHTML={{__html: text}}></h3>

export default Heading
