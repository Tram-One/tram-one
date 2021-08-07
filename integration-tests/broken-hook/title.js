const { registerHtml, useEffect } = require('../../src/tram-one')

const html = registerHtml()

useEffect(() => {})

/**
 * broken component misplaced hook
 */
module.exports = () => {
	return html`
		<header>
			<h1 class="title">Home Page</h1>
		</header>
	`
}
