import React from 'react'
import { render } from 'react-dom'

import config from 'tapestry.js'

const Post = config.components.Post

render(
  <Post />,
  document.getElementById('root')
)