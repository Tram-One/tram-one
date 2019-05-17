const { registerDom } = require('./dom')

const registerHtml = (globalSpace = window) => (registry) => {
  return registerDom(globalSpace)(null, registry)
}

const registerSvg = (globalSpace = window) => (registry) => {
  return registerDom(globalSpace)('http://www.w3.org/2000/svg', registry)
}

module.exports = { registerHtml, registerSvg }
