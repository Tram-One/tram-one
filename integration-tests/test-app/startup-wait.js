const { registerHtml, useStore, useEffect } = require('../../src/tram-one')

const html = registerHtml()

/**
 * component to test effects on mount
 */
module.exports = () => {
	const initialWait = useStore({ isDone: false })

	// after the element first renders, run effect to set isDone to true
	useEffect(() => {
		initialWait.isDone = true
	})

	return html`
		<p class="startup-wait" role="is-page-loading">
			The page is ${initialWait.isDone ? 'done' : 'loading'}.
		</p>
	`
}
