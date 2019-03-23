const rlite = require('rlite-router')
const { assertIsFunction } = require('../asserts')

const defaultGetPath = () => window.location.href.replace(window.location.origin, '')

const routeElement = (getPath = defaultGetPath) => {
  assertIsFunction(getPath, 'getPath', false)

  return (attrs, children) => {
    if (!attrs.path) return attrs.component({}, children)
    return rlite(() => '', {
      [attrs.path]: (params) => attrs.component({params, path: attrs.path}, children)
    })(getPath())
  }
}

const switchElement = (getPath = defaultGetPath) => {
  assertIsFunction(getPath, 'getPath', false)

  return (attrs, children) => {
    return children.filter(child => (typeof child === 'object'))[0]
  }
}

module.exports = { routeElement, switchElement }
