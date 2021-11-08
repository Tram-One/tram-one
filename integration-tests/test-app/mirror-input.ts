import { registerHtml, useGlobalStore, TramOneComponent } from '../../src/tram-one';
import submirrorinput from './sub-mirror-input';

const html = registerHtml({
	'sub-mirror-input': submirrorinput,
});

/**
 * component to test url parameters
 */
const mirrorInput: TramOneComponent = () => {
	const mirrorable = useGlobalStore('mirrorable-input', { value: '' });

	const onEvent = (event: Event) => {
		mirrorable.value = (event.target as HTMLInputElement).value;
	};

	return html`
		<div>
			<label for="mirrorable-input">Mirror Input</label>
			<input
				id="mirrorable-input"
				class="main input-component"
				type="text"
				value=${mirrorable.value}
				onkeyup=${onEvent}
			/>
			<sub-mirror-input />
		</div>
	`;
};

export default mirrorInput;
