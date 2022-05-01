const useUrlParams = require('use-url-params');
import { registerHtml, start } from '../../src/tram-one';

import elementRendering from './element-rendering';
import elementSwitcher from './element-switcher';

const html = registerHtml({
	'element-rendering': elementRendering,
	'element-switcher': elementSwitcher,
});

/**
 * main app to power integration tests
 */
export const app = () => {
	if (useUrlParams('/element-rendering').matches) return html`<div><element-rendering /></div>`;
	if (useUrlParams('/element-switcher').matches) return html`<div><element-switcher /></div>`;
	return html`
		<main>
			<h1>Performance Test App</h1>
		</main>
	`;
};

export const startApp = (container: any) => {
	let appContainer = container;
	if (!appContainer) {
		// before we setup the app, cleanup the document state if this was called before
		const previousApp = document.querySelector('#app');
		if (previousApp) previousApp.remove();

		// setup the container for the app
		appContainer = document.createElement('div');
		appContainer.id = 'app';

		// attach the container to the document
		// this is required, since focus and visibility checks depend on being in the document
		window.document.body.appendChild(appContainer);
	}

	start(app, appContainer);

	return {
		container: appContainer,
	};
};

if (document.querySelector('#parcel-page')) {
	startApp('#parcel-page');
}
