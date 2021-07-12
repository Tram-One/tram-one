const { registerHtml, useGlobalStore } = require('../../src/tram-one')

const html = registerHtml({
	'sub-mirrorable-input': require('./sub-mirror-input')
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
			<label for="sub-mirrorable-input">Sub Mirror Input</label>
			<input id="sub-mirrorable-input" class="main input-component" type="text" value=${mirrorable.value} onkeyup=${onEvent} />
		</div>
	`
}
