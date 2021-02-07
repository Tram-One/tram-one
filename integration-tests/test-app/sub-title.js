const { registerHtml } = require('../../src/tram-one')

const html = registerHtml()

/**
 * component to test basic rendering
 */
module.exports = (props, children) => {
	return html`
		<h2>${children}</h2>
	`
}
