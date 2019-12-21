const { registerHtml, useEffect, useObservable } = require('../../src/tram-one')
const home = require('./home')
const loading = require('./loading')

const html = registerHtml({
	home, loading
})

module.exports = () => {
	const [isFetching, setIsFetching] = useObservable(true)
	useEffect(() => {
		setIsFetching(false)
	})

	return html`
		<home>
			${isFetching ? 'Fetching...' : 'Finished Fetching!'}
			<loading />
		</home>
	`
}
