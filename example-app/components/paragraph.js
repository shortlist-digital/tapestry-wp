import React from 'react'

const Paragraph = ({paragraph}) =>
  <div dangerouslySetInnerHTML={{__html: paragraph}}></div>

export default Paragraph
