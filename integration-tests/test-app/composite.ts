import { registerHtml, useStore, useEffect, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * Element to test fragments
 */
const composite: TramOneComponent = () => {
	const store = useStore({ count: 0 });
	useEffect(() => {
		store.count++;
	});

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

export default composite;
