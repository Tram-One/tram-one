const { registerHtml, useEffect } = require('../../src/tram-one')

const html = registerHtml()

// other hooks also generate the same error
// so we don't need to check those, just useEffect is fine
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
