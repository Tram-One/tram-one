const { registerHtml, useObservable } = require('../../src/tram-one')
const html = registerHtml()

module.exports = () => {
	const [count, setCount] = useObservable(0)
	const increment = () => setCount(count + 1)
	return html`<button data-testid="updatable-button" onclick=${increment}>${count}</button>`
}
