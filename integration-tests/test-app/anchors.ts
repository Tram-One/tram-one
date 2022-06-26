import { registerHtml, useUrlParams, TramOneComponent } from '../../src/tram-one';
import anchorSet from './anchor-set';

const html = registerHtml({
	'anchor-set': anchorSet,
});

/**
 * Element to test behavior or wrapping a single component
 */
const anchors: TramOneComponent = () => {
	if (useUrlParams().hash !== 'testing') return html`<anchor-set />`;
	return html`<section>Anchor Set</section>`;
};

export default anchors;
