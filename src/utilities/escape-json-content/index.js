
// Add a stringify template helper for outputting JSON with forward
// slashes escaped to prevent '</script>' tag output in JSON within
// script tags. See http://stackoverflow.com/questions/66837/when-is-a-cdata-section-necessary-within-a-script-tag/1450633#1450633

// Escape u2028 and u2029
// http://timelessrepo.com/json-isnt-a-javascript-subset
// https://github.com/mapbox/tilestream-pro/issues/1638
export default (json) => {
  return JSON
    .stringify(json)
    .replace(/\//g, '\\/')
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}
