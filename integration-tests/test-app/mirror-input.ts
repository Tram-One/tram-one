import { registerHtml, useGlobalStore } from '../../src/tram-one'
import submirrorinput from './sub-mirror-input'

const html = registerHtml({
	'sub-mirror-input': submirrorinput
})

/**
 * component to test url parameters
 */
export default () => {
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
