import { registerHtml, useStore, useEffect, useUrlParams, TramOneComponent } from '../../src/tram-one';
import anchorSet from './anchor-set';

const html = registerHtml({
	'anchor-set': anchorSet,
});

/**
 * Element to test behavior or wrapping a single component
 */
const anchors: TramOneComponent = () => {
	const anchorStore = useStore({ effectTriggered: false });
	useEffect(() => {
		anchorStore.effectTriggered = true;
	});

	if (useUrlParams().hash !== 'testing') return html`<anchor-set />`;
	return html`<section>Anchor Set - effect triggered: ${anchorStore.effectTriggered}</section>`;
};

export default anchors;
