const { registerHtml } = require('../../src/tram-one')
const html = registerHtml()

module.exports = (props, children) => html`
	<div data-testid="home-page">
		Home Page
		${children}
	</div>
`
