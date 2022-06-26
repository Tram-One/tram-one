import { registerHtml, useUrlParams, useStore, TramOneComponent } from '../../src/tram-one';
import fragmentList from './fragment-list';

const html = registerHtml({
	'fragment-list': fragmentList,
});

/**
 * Element to test behavior or wrapping a single component
 */
const listContainer: TramOneComponent = () => {
	const params = useUrlParams('');
	const counterStore = useStore({ value: 0 });
	if (params.hash !== 'testing') return html`<anchor-set />`;

	const increment = () => counterStore.value++;

	return html`
		<section>
			<button onclick=${increment}>${counterStore.value} + 1, 2</button>
			<ol>
				<fragment-list index=${counterStore.value + 1} />
			</ol>
			<ul>
				<fragment-list index=${counterStore.value + 2} />
			</ul>
		</section>
	`;
};

export default listContainer;
