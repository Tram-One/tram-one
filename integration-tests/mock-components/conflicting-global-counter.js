const { registerHtml, useGlobalObservable } = require('../../src/tram-one')
const html = registerHtml()

module.exports = () => {
	// example where it is undefined first
	useGlobalObservable('global-counter', undefined)
	const [counter] = useGlobalObservable('global-counter', 5)

	// example where it is defined first
	useGlobalObservable('global-counter-2', 5)
	const [counter2] = useGlobalObservable('global-counter-2', undefined)

	return html`
		<div>
			<button data-testid="global-counter">
				${counter}
			</button>
			<button data-testid="global-counter-2">
				${counter2}
			</button>
		</div>
	`
}
