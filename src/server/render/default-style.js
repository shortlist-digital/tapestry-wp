import 'glamor/reset'
import { insertRule } from 'glamor'

const style = `
  /* strict reset */
  body,
  h1, h2, h3, h4, h5, h6,
  p, blockquote, pre,
  dl, dd, ol, ul,
  form, fieldset, legend,
  figure,
  iframe,
  table, th, td, caption,
  hr {
    margin:  0;
    padding: 0;
  }
  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
  }
  iframe {
    border: 0;
    width: 100%;
  }
  button {
    appearance: none;
    background-color: transparent;
    border-radius: 0;
    border: 0;
    padding: 0;
  }
  a {
    color: inherit;
  }

  /* global styles */
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  html {
    box-sizing: border-box;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  body {
    font-size: 100%;
    min-height: 100%;
    position: relative;
  }

  /* media common styles */
  img {
    font-style: italic;
    max-width: 100%;
    vertical-align: middle;
  }
  img[width],
  img[height] {
    max-width: none;
  }
  svg {
    height: auto;
    max-width: 100%;
    vertical-align: middle;
  }
  svg path {
    fill: currentColor;
  }
`

insertRule(style)

export default style
