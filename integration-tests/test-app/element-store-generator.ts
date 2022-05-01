import { registerHtml, useStore, TramOneComponent } from '../../src/tram-one';
import elementwithstore from './element-with-store';

const html = registerHtml({
	elementwithstore,
});

/**
 * Element to verify non-standard input controls, and also verify memory leak type issues
 */
const elementstoregenerator: TramOneComponent = () => {
	const storeGeneratorStore = useStore({ count: 0 });
	const incrementCount = (event: InputEvent) => {
		const inputElement = event.target as HTMLInputElement;
		storeGeneratorStore.count = parseInt(inputElement.value);
	};
	const storeElements = [...new Array(storeGeneratorStore.count)].map((_, index) => {
		return html`<elementwithstore value=${index} />`;
	});
	return html`<section>
		<label for="store-generator">Store Generator</label>
		<input
			id="store-generator"
			type="range"
			min="0"
			max="5"
			value=${storeGeneratorStore.count}
			onchange=${incrementCount}
		/>
		${storeElements}
	</section>`;
};

export default elementstoregenerator;
