const { registerHtml, useGlobalStore } = require('../../src/tram-one')

const html = registerHtml({
	'sub-mirror-input': require('./sub-mirror-input')
})

/**
 * component to test url parameters
 */
module.exports = () => {
	const mirrorable = useGlobalStore('mirrorable-input', { value: '' })

	const onEvent = event => {
		mirrorable.value = event.target.value
	}

	return html`
		<div>
			<label for="mirrorable-input">Mirror Input</label>
			<input id="mirrorable-input" class="main input-component" type="text" value=${mirrorable.value} onkeyup=${onEvent} />
			<sub-mirror-input />
		</div>
	`
}
