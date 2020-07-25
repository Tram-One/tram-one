const { registerHtml, useObservable } = require('../../src/tram-one')
const html = registerHtml()

module.exports = () => {
	const [,, rawCounter] = useObservable({ now: { clicks: 0 } })
	const onclick = () => {
		// while a spread operator would work for single nested objects
		// for objects that are deeply nested, we need to use raw to
		// transform the entire object to it's raw value
		rawCounter.now.clicks += 1
	}

	return html`
		<div data-testid="home">
			<button onclick=${onclick}>
				clicks: ${rawCounter.now.clicks}
			</button>
		</div>
	`
}
