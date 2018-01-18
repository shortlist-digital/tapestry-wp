export default path => {
  if (path === '/') return path

  return (
    path
      // replace multiple sibling slashes
      .replace(/([^:])(\/\/+)/g, '$1/')
      // remove leading and trailing slashes
      .replace(/^\/+|\/+$/g, '')
  )
}
