const { registerHtml, useGlobalStore } = require('../../src/tram-one')

const html = registerHtml({
	'sub-mirrorable-input': require('./sub-mirror-input')
})

/**
 * component to test url parameters
 */
module.exports = () => {
	const mirrorable = useGlobalStore('mirrorable-input')

	const onEvent = event => {
		mirrorable.value = event.target.value
	}

	const letterSpans = [...new Array(mirrorable.value.length)].map(() => html`<span class="letter-span">-</span>`)

	return html`
		<div>
			${letterSpans}
			<label for="sub-mirrorable-input">Sub Mirror Input</label>
			<input id="sub-mirrorable-input" class="main input-component" type="text" value=${mirrorable.value} onkeyup=${onEvent} />
		</div>
	`
}
