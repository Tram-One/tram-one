import { TramWindow } from '../src/types';

const { waitFor } = require('@testing-library/dom');
const { startApp } = require('./test-app');

/**
 * decorated startApp function that ensures that the app's mutation observers
 * have kicked in before starting to interact with the app
 */
export const startAppAndWait = async () => {
	const app = startApp();

	await waitFor(() => {
		// this waitFor is required to have the initial mutation observer trigger
		expect(Object.keys((window as unknown as TramWindow)['tram-space']['tram-key-store']).length).toBeGreaterThan(0);
	});

	return app;
};
