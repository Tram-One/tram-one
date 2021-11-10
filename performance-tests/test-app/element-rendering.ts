const { registerHtml, useStore } = require('../../src/tram-one');

const html = registerHtml();

/**
 * This page has an input that changes the total number of elements on the page
 */
export default () => {
	const pageStore = useStore({ queue: '1000', elements: '1000', startTimer: 0, endTimer: 0, renders: 0 });

	const updateCount = (event: any) => {
		pageStore.queue = event.target.value;
	};

	const render = () => {
		pageStore.renders++;
		pageStore.startTimer = performance.now();
		pageStore.elements = pageStore.queue;
		pageStore.endTimer = performance.now();
	};

	const numberOfElements = Number.parseInt(pageStore.elements, 10);
	const newSpan = () => html`<span>-</span>`;
	const elements = [...new Array(Number.isNaN(numberOfElements) ? 0 : numberOfElements)].map(newSpan);

	return html`
		<section>
			<h1>Element Rendering Example</h1>
			<figure>Wait: ${pageStore.endTimer - pageStore.startTimer}</figure>
			<label for="element-count">Element Count</label>
			<input id="element-count" value=${pageStore.queue} onkeyup=${updateCount} />
			<button onclick=${render} renders=${pageStore.renders}>Render</button>
			<br />
			${elements}
		</section>
	`;
};
