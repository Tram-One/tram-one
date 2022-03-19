import { registerHtml, useEffect, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * component to be the first element resolved with use-effects
 */
const account: TramOneComponent = () => {
	useEffect(() => {
		document.title = 'Tram-One Testing App';
	});
	return html` <div class="document-title-setter" /> `;
};

export default account;
