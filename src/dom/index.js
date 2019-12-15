const { registerDom } = require('./dom')
const { registerHtml, registerSvg } = require('./dom-wrappers')
const observeTag = require('./observe-tag')
const processEffects = require('./process-effects')

module.exports = {
	registerDom, registerHtml, registerSvg,
	observeTag, processEffects
}
