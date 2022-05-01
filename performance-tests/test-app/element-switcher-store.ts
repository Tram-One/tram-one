const { registerHtml, useStore } = require('../../src/tram-one');

const html = registerHtml();

/**
 * Dynamicly generated component that could possibly cause memory leaks
 */
export default () => {
	const subElementStore = useStore({ active: 1 });
	return html` <span class="ElementSwitcherStore">${subElementStore.active},</span> `;
};
