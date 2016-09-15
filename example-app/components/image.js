import React from 'react'

const Image = ({image, caption}) =>
  <div>
    <img
      src={image.url}
      style={{
        maxWidth:'100%',
        width: '100%',
        marginBottom: '25px'
      }}
    />
    <small
      dangerouslySetInnerHTML={{__html:caption}}>
    </small>
  </div>

export default Image
