const { getByText, fireEvent, waitFor, getByPlaceholderText } = require('@testing-library/dom');
const { startApp } = require('./test-app');
const { startAppAndWait } = require('./test-helpers');

/**
 * The following tests are intentional test that validate the behavior of new features.
 */

describe('Tram-One', () => {
	it('should render on a Node', () => {
		// mount the app on the container
		const container = document.createElement('div');
		startApp(container);

		// verify that the home page is rendered
		expect(container).toHaveTextContent('Test Page Content');
	});

	it('should render on the window with a selector', () => {
		// create and attach an element to the window
		const appContainer = document.createElement('div');
		appContainer.id = 'app';
		window.document.body.appendChild(appContainer);

		// start the app using a css selector
		startApp('#app');

		// verify that the home page is rendered
		expect(appContainer).toHaveTextContent('Test Page Content');

		// cleanup - remove app
		appContainer.remove();
	});

	it('should render html from registry', () => {
		// start the app
		const { container } = startApp();

		// verify that the home page is rendered with a registered component
		expect(getByText(container, 'Home Page')).toBeVisible();
	});

	it('should render with props and children correctly', () => {
		// start the app
		const { container } = startApp();

		// verify that app processes children correctly
		expect(getByText(container, 'Sub Title Child')).toBeVisible();

		// verify that app processes props correctly
		expect(getByText(container, 'Sub Title Prop')).toBeVisible();
	});

	it('should render svg graphics', () => {
		// start the app
		const { container } = startApp();

		// verify a basic svg is rendered
		expect(container).toHaveTextContent('Test SVG');
	});

	it('should update components on observer updates', () => {
		// start the app
		const { container } = startApp();

		// verify the button exists with the default value
		expect(getByText(container, 'Total Clicks: 0')).toBeVisible();

		// click on the button
		fireEvent.click(getByText(container, 'Total Clicks: 0'));

		// verify the button updated with the new value
		expect(getByText(container, 'Total Clicks: 1')).toBeVisible();
	});

	it('should process effects on mount', async () => {
		// start the app
		const { container } = startApp();

		// verify that it has the loading text
		expect(getByText(container, 'The page is loading.')).toBeVisible();

		// wait for mutation observer to pick up new elements
		await waitFor(() => {});

		// verify that it (eventually) has the finished text
		expect(getByText(container, 'The page is done.')).toBeVisible();
	});

	it('should process effects on the root node', async () => {
		// start the app
		const { container } = startApp();

		// verify that it (eventually) has loaded: true
		await waitFor(() => {
			expect(getByText(container, 'Root Loaded: true')).toBeVisible();
		});
	});

	it('should process cleanup effects', async () => {
		// start the app
		const { container } = startApp();

		// verify that the tab is rendered and the dismiss button is there
		expect(getByText(container, 'Updated: false')).toBeVisible();
		expect(getByText(container, 'Dismiss')).toBeVisible();

		// wait for mutation observer to pick up new elements
		await waitFor(() => {});

		// dismiss tab to trigger cleanup effect
		fireEvent.click(getByText(container, 'Dismiss'));

		// verify that effect cleanup was triggered
		await waitFor(() => {
			expect(getByText(container, 'Tab Dismissed')).toBeVisible();
		});
	});

	it('should process updated effects', async () => {
		// start the app
		const { container } = startApp();

		// verify that the tab is rendered and the lock button is there
		expect(getByText(container, 'Updated: false')).toBeVisible();
		expect(getByText(container, 'Lock Tab')).toBeVisible();

		// wait for mutation observer to pick up new elements
		await waitFor(() => {});

		// dismiss tab to trigger cleanup effect
		fireEvent.click(getByText(container, 'Lock Tab'));

		// verify that effect update was triggered
		await waitFor(() => {
			expect(getByText(container, 'Updated: true')).toBeVisible();
		});
	});

	it('should re-render components dependent on url params', () => {
		// start the app
		const { container } = startApp();

		// verify that the default values show up
		expect(getByText(container, 'Account: No Account Info')).toBeVisible();
		expect(getByText(container, 'Is Account Logged In: No')).toBeVisible();

		// set the account in the url params
		window.history.pushState({}, '', '/test_account');

		// verify the account info updated
		expect(getByText(container, 'Account: test_account')).toBeVisible();

		// set the query parameter loggedIn
		window.history.pushState({}, '', '/test_account?loggedIn=Yes');

		// verify the account info updated
		expect(getByText(container, 'Is Account Logged In: Yes')).toBeVisible();
	});

	it('should process effects on the element passed through use-effect', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// verify the effect properly focused the input element
		expect(getByPlaceholderText(container, 'Input for automatic focus')).toHaveFocus();
	});
});
