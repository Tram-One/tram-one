import { registerHtml, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * component to test basic rendering
 */
const subTitle: TramOneComponent = (props, children) => {
	return html` <h2>${children}</h2> `;
};

export default subTitle;
