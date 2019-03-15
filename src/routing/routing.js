const rlite = require('rlite-router')

const defaultGetPath = () => window.location.href.replace(window.location.origin, '')
const routeElement = (getPath = defaultGetPath) => {
  return (attrs, children) => {
    return rlite(() => '', {
      [attrs.path]: (params) => attrs.component({params, path: attrs.path}, children)
    })(getPath())
  }
}

const switchElement = (getPath = defaultGetPath) => {
  return (attrs, children) => {
    return children.filter(child => (typeof child === 'object'))[0]
  }
}

module.exports = { routeElement, switchElement }
