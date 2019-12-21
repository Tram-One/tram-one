const { registerHtml, useObservable, useEffect } = require('../../src/tram-one')
const html = registerHtml()

module.exports = () => {
	const [loading, setLoading] = useObservable(true)
	useEffect(() => {
		setLoading(false)
	})
	return html`
		<div data-testid="loader">
			${loading ? 'loading...' : 'Finished loading!'}
		</div>
	`
}
