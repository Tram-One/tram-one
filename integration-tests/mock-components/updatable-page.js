const { registerHtml, useObservable } = require('../../src/tram-one')
const home = require('./home')
const updatedEffect = require('./updated-effect')

const html = registerHtml({
	home,
	'updated-effect': updatedEffect
})

module.exports = () => {
	const [count, setCount] = useObservable(5)

	const increment = () => setCount(count + 1)
	return html`
		<home>
			<button data-testid="increment-count" onclick=${increment}>Increment</button>
			<updated-effect initialCount=${count} />
		</home>
	`
}
