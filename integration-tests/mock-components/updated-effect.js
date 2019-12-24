const { registerHtml, useObservable, useEffect } = require('../../src/tram-one')
const html = registerHtml()

module.exports = ({ initialCount }) => {
	const [counter] = useObservable({ count: Number(initialCount) })
	const increment = () => { counter.count += 1 }
	useEffect(() => {
		document.title = `The count is ${counter.count}`
		return () => { document.title = `The count was ${counter.count}` }
	})

	return html`<button data-testid="updatable-button" onclick=${increment}>${counter.count}</button>`
}
