/*
 * namespace is a generic interface for global tram-one state that needs
 * to be persisted in the app container. It exposes a setup and get function.
 */

import { TramWindow } from './types';

const getTramWindow = (): TramWindow => {
	// if tram-one is setup it will have a defined value in the 'tram-space'
	const tramOneIsSetup = (window as unknown as TramWindow)['tram-space'];

	// otherwise, we should warn
	// this usually happens when calling a hook outside of a component function
	// but this could be potentially triggered other ways - if we find those, we should broaden the message then
	if (!tramOneIsSetup) {
		throw new Error(`
			Tram-One: app has not started yet, but hook was called. Is it being invoked outside a component function?
			https://github.com/Tram-One/tram-one/issues/178
		`);
	}

	return window as unknown as TramWindow;
};

export const setupTramOneSpace = () => {
	(window as unknown as TramWindow)['tram-space'] = {};
};

export const buildNamespace = <NamespaceStore>(constructor: () => NamespaceStore) => {
	const setup = (namespace: string): NamespaceStore => {
		const tramWindow = getTramWindow();
		tramWindow['tram-space'][namespace] = constructor();
		return tramWindow['tram-space'][namespace];
	};

	const get = (namespace: string): NamespaceStore => {
		const tramWindow = getTramWindow();
		return tramWindow['tram-space'][namespace];
	};

	const set = (namespace: string, value: NamespaceStore) => {
		const tramWindow = getTramWindow();
		tramWindow['tram-space'][namespace] = value;
	};

	return { setup, get, set };
};
