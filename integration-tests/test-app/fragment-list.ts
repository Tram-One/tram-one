import { registerHtml, useStore, TramOneComponent } from '../../src/tram-one';
import fragment from '../../src/fragment';

const html = registerHtml({
	'': fragment,
});

/**
 * Test with fragment element
 */
const fragmentList: TramOneComponent<{ index: number }> = ({ index }) => {
	const counterStore = useStore({ value: 0 });

	const increment = () => counterStore.value++;

	return html`
		<>
			<button onclick=${increment}>(${counterStore.value} + N) * ${index}</button>
			<li>Test ${(counterStore.value + 1) * index}</li>
			<li>Test ${(counterStore.value + 2) * index}</li>
			<li>Test ${(counterStore.value + 3) * index}</li>
			<li>Test ${(counterStore.value + 4) * index}</li>
		</>
	`;
};

export default fragmentList;
