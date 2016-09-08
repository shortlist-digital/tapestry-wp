import React from 'react'

let Paragraph = ({paragraph}) =>
  <p dangerouslySetInnerHTML={{__html: paragraph}}></p>

export default Paragraph
