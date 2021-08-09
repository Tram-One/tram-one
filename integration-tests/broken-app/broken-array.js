const { registerHtml } = require('../../src/tram-one')

const html = registerHtml()

/**
 * broken component (returns an array)
 */
module.exports = () => {
	return [
		html`<h1>Hello</h1>`,
		html`<h2>World</h2>`
	]
}
