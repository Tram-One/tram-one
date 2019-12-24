const { registerHtml, useEffect } = require('../../src/tram-one')
const html = registerHtml()

module.exports = ({ onCleanupEffect }) => {
	useEffect(() => {
		return onCleanupEffect
	})
	return html`<div data-testid="removable-element">Removable</div>`
}
