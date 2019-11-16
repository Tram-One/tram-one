const { registerDom } = require('./dom')

/**
 * This file contains two functions, registerHtml and
 * registerSvg, they are implementations of registerDom
 * and are the only exposed interface to users of Tram-One.
 * @see https://tram-one.io/api/#Tram-One#registerHtml
 * @see https://tram-one.io/api/#Tram-One#registerSvg
 */

const registerHtml = globalSpace => registry => {
	return registerDom(globalSpace)(null, registry)
}

const registerSvg = globalSpace => registry => {
	return registerDom(globalSpace)('http://www.w3.org/2000/svg', registry)
}

module.exports = { registerHtml, registerSvg }
