import React from 'react'

let Image = ({image, caption}) =>
  <div>
    <img
      src={image.url}
      style={{maxWidth:'100%', width: '100%'}}
    />
    <small dangerouslySetInnerHTML={{__html:caption}}></small>
  </div>

export default Image
