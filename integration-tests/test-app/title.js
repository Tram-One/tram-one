const { registerHtml } = require('../../src/tram-one')

const html = registerHtml({
	// sub-title to test multiple instances of the same tag
	'sub-title': require('./sub-title')
})

/**
 * component to test basic rendering
 */
module.exports = (props, children) => {
	const { subtitle = '' } = props
	return html`
		<header>
			<h1 class="title">Home Page</h1>
			<sub-title>${children}</sub-title>
			<sub-title>${subtitle}</sub-title>
		</header>
	`
}
