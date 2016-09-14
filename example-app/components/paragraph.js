import React from 'react'

let Paragraph = ({paragraph}) =>
  <div dangerouslySetInnerHTML={{__html: paragraph}}></div>

export default Paragraph
