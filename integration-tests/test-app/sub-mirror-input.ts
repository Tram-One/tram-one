import { registerHtml, useGlobalStore } from '../../src/tram-one';

const html = registerHtml({
	'sub-mirrorable-input': require('./sub-mirror-input'),
});

type InputObject = { value: string };

/**
 * component to test url parameters
 */
export default () => {
	const mirrorable = useGlobalStore('mirrorable-input') as InputObject;

	const onEvent = (event) => {
		mirrorable.value = event.target.value;
	};

	const letterSpans = [...new Array(mirrorable.value.length)].map(() => html`<span class="letter-span">-</span>`);

	return html`
		<div>
			${letterSpans}
			<label for="sub-mirrorable-input">Sub Mirror Input</label>
			<input
				id="sub-mirrorable-input"
				class="main input-component"
				type="text"
				value=${mirrorable.value}
				onkeyup=${onEvent}
			/>
		</div>
	`;
};
