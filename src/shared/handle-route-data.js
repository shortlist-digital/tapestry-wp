import fetch from 'isomorphic-fetch'


const getApiPath = (type, params, context) => {
  // based on data-type e.g. FrontPage, Post, Page
  // return API path
  switch (type) {
    case 'FrontPage': {
      // if frontPage is declared as an ID
      if (parseInt(context.frontPage))
        return `pages/${context.frontPage}`
      // if frontPage is declared as as a slug/name
      else if (typeof context.frontPage === 'string')
        return `pages?slug=${context.frontPage}`
      // return allll posts
      else
       return `posts?_embed`
    }
    case 'Post':
      // return array of posts
      return `posts?slug=${params.postname}&_embed`
    case 'Category':
      // return array of filtered posts by category
      return `posts?filter[category_name]=${params.subcategory || params.category}&_embed`
    case 'Page':
      // return single page from slug
      return `pages?slug=${params.subpage || params.page}&_embed`
  }
}
const normalizeResponse = resp => {
  // if resp is a single item array, return object within
  if (resp.constructor === Array && resp.length === 1) {
    return resp[0]
  }
  // more normalizing to happen here if iterable array like objects exist etc.
  return resp
}

export default (type, { params, loadContext, cb }) => {
  // go run the custom loader if declared
  const customLoader = loadContext.loaders && loadContext.loaders[type]
  if (customLoader)
    return customLoader(loadContext, cb)
  // create API path
  const baseUrl = `${loadContext.serverUri || window.location.origin}/api/v1`
  const pathUrl = getApiPath(type, params, loadContext)
  // go and fetch data from constructed API path
  // run callback from AsyncProps
  return fetch(`${baseUrl}/${pathUrl}`)
    .then(resp => {
      // catch server error
      if (!resp.ok) throw new Error(resp)
      return resp
    })
    .then(resp => resp.json())
    .then(resp => cb(null, {
      data: normalizeResponse(resp)
    }))
    .catch(error => cb(error))
}
