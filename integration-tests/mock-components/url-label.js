const { registerHtml, useUrlParams } = require('../../src/tram-one')
const html = registerHtml()

module.exports = () => {
	const { color } = useUrlParams('/color/:color')
	return html`
		<div data-testid="color-label">
			${color}
		</div>
	`
}
