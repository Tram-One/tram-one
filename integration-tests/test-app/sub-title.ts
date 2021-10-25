import { registerHtml } from '../../src/tram-one';

const html = registerHtml();

/**
 * component to test basic rendering
 */
export default (props: any, children: Element) => {
	return html` <h2>${children}</h2> `;
};
