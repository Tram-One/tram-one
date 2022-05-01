import { registerHtml, useStore, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * Dynamicly generated component that could possibly cause memory leaks
 */
const elementwithstore: TramOneComponent = ({ value }) => {
	const subElementStore = useStore({ active: value });
	return html` <span>${subElementStore.active},</span> `;
};

export default elementwithstore;
