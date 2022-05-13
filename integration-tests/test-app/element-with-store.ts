import { registerHtml, useStore, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * Dynamicly generated component that could possibly cause memory leaks
 */
const elementwithstore: TramOneComponent = ({ index }) => {
	const subElementStore = useStore({ count: 0 });
	const onIncrement = () => subElementStore.count++;
	return html` <button onclick=${onIncrement}>[${index}: ${subElementStore.count}]</button> `;
};

export default elementwithstore;
