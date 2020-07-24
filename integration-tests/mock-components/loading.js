const { registerHtml, useObservable, useEffect } = require('../../src/tram-one')
const html = registerHtml()

module.exports = () => {
	const [loading, setLoading] = useObservable(true)
	const [loading2, setLoading2] = useObservable(true)
	useEffect(() => {
		setLoading(false)
	})
	useEffect(() => {
		setLoading2(false)
	})
	return html`
		<div data-testid="loader">
			${loading ? 'loading...' : 'Finished loading!'}
			${loading2 ? 'loading2...' : 'Finished loading2!'}
		</div>
	`
}
