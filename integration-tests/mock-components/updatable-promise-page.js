const { registerHtml, useObservable } = require('../../src/tram-one')
const home = require('./home')
const updatedPromise = require('./updated-promise')

const html = registerHtml({
	home,
	'updated-effect': updatedPromise
})

module.exports = () => {
	const [count, setCount] = useObservable(5)
	const [showCount, setShowCount] = useObservable(true)

	const increment = () => setCount(count + 1)

	const removeCount = () => {
		setShowCount(false)
	}

	return html`
		<home>
			<button data-testid="increment-count" onclick=${increment}>Increment</button>
			<button data-testid="remove-count" onclick=${removeCount}>Remove Count</button>
			${showCount ? html`<updated-effect initialCount=${count} />` : 'Counter Removed'}
		</home>
	`
}
