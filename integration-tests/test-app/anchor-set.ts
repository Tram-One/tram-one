import { registerHtml, useEffect, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * Element with a use effect (to test behavior when wrapped)
 */
const anchorSet: TramOneComponent = () => {
	useEffect(() => {
		window.location.hash = 'testing';
	});
	return html`<section />`;
};

export default anchorSet;
