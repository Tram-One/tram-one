const { registerDom } = require('./dom')

/**
 * function to generate a tagged template function for XHTML
 * - for complete documentation, please refer to http://tram-one.io/#tram-html
 *
 * @param {object} registry
 * @return {function}
 */
const registerHtml = (globalSpace = window) => (registry) => {
  return registerDom(globalSpace)(null, registry)
}

/**
 * function to generate a tagged template function for SVG
 * - for complete documentation, please refer to http://tram-one.io/#tram-svg
 *
 * @param {object} registry
 * @return {function}
 */
const registerSvg = (globalSpace = window) => (registry) => {
  return registerDom(globalSpace)('http://www.w3.org/2000/svg', registry)
}

module.exports = { registerHtml, registerSvg }
