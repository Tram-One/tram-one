const { registerHtml, useObservable, useEffect } = require('../../src/tram-one')
const html = registerHtml()

module.exports = ({ initialCount }) => {
	const [counter] = useObservable({ count: Number(initialCount) })
	const increment = () => { counter.count += 1 }
	useEffect(async () => {
		document.title = `The count is ${counter.count}`
	})

	return html`<button data-testid="updatable-button" onclick=${increment}>${counter.count}</button>`
}
