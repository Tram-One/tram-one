const { registerHtml, useGlobalObservable } = require('../../src/tram-one')
const html = registerHtml()

module.exports = ({ testId }) => {
	const [counter, setCounter] = useGlobalObservable('global-counter', 0)
	const increment = () => setCounter(counter + 1)
	return html`
		<button data-testid=${testId} onclick=${increment}>
			${counter}
		</button>
	`
}
