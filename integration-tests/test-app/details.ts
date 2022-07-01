import { registerHtml, useStore, TramOneComponent } from '../../src/tram-one';
import fragment from '../../src/fragment';

const html = registerHtml({
	'': fragment,
});

/**
 * Element to test fragments
 */
const details: TramOneComponent = () => {
	const store = useStore({ count: 0 });

	const incrementCounter = () => store.count++;
	const header = html`
		<>
			<h3>Top of Description</h3>
			<button onclick=${incrementCounter}>Title Counter: ${store.count}</button>
		</>
	`;
	const body = html`
		<>
			Some Details
			<button onclick=${incrementCounter}>Details Counter: ${store.count}</button>
		</>
	`;

	return html`
		<section>
			<button onclick=${incrementCounter}>Click to Increment: ${store.count}</button>
			${header}<br />
			${body}
		</section>
	`;
};

export default details;
