import { registerHtml, start, useEffect, useStore } from '../../src/tram-one';
import title from './title';
import logo from './logo';
import clicktracker from './click-tracker';
import startupwait from './startup-wait';
import tab from './tab';
import account from './account';
import tasks from './tasks';
import mirrorinput from './mirror-input';
import documentTitleSetter from './document-title-setter';
import elementstoregenerator from './element-store-generator';
import { TramWindow } from '../../src/types';
import anchors from './anchors';
import focusInput from './focus-input';
import listContainers from './list-containers';

const html = registerHtml({
	title: title,
	logo: logo,
	'click-tracker': clicktracker,
	'startup-wait': startupwait,
	tab: tab,
	account: account,
	tasks: tasks,
	'mirror-input': mirrorinput,
	'document-title-setter': documentTitleSetter,
	'element-store-generator': elementstoregenerator,
	anchors: anchors,
	'focus-input': focusInput,
	'list-containers': listContainers,
});

/**
 * main app to power integration tests
 */
export const app = () => {
	const rootStore = useStore({ loaded: false });

	/* root component effects */
	useEffect(() => {
		rootStore.loaded = true;
	});

	return html`
		<main>
			<!-- for regression testing, it is important that document-title-setter is the first element -->
			<document-title-setter />

			<title subtitle="Sub Title Prop">Sub Title Child</title>
			<focus-input />
			<p>Root Loaded: ${rootStore.loaded}</p>
			<logo />
			<account />
			<p>Test Page Content</p>
			<click-tracker />
			<startup-wait />
			<tab />
			<tasks />
			<mirror-input />
			<element-store-generator />
			<anchors />
			<list-containers />
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

	// remove all existing state in the tram-space (since the app does not run in an isolated way)
	Object.keys((window as unknown as TramWindow)['tram-space'] || {}).forEach((globalStore) => {
		delete (window as unknown as TramWindow)['tram-space'][globalStore];
	});

	start(app, appContainer);

	return {
		container: appContainer,
	};
};

// next block is only used when running the app with `npm run test:app`
/* istanbul ignore next */
if (document.querySelector('#parcel-page')) {
	startApp('#parcel-page');
}
