import isFunction from 'lodash.isfunction'
import isPlainObject from 'lodash.isplainobject'

export default ({ paths, params, cb }) => {
  // resolve function if required
  if (isFunction(paths)) {
    paths = paths(params)
  }
  // return
  if (typeof cb !== 'function') {
    return { paths }
  }
  // handle endpoint configurations
  // can be one of Array, Object, String
  if (Array.isArray(paths)) {
    return {
      paths,
      result: paths.map(cb)
    }
  }

  if (isPlainObject(paths)) {
    return {
      paths,
      result: Object.keys(paths).map(i => cb(paths[i]))
    }
  }

  return {
    paths,
    result: cb(paths)
  }
}
