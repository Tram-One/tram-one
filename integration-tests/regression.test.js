const { getByText, fireEvent, waitFor } = require('@testing-library/dom')
const { startApp } = require('./test-app')

describe('Tram-One - regressions', () => {
	it('should not call cleanups that are not functions', async () => {
		// start the app
		const { container } = startApp()

		// previously this would fail because the cleanup was called,
		// even though it was not a function, and instead was a promise (the result of an async function)
		// the fix was to do the same check we do in other places, to make sure cleanup is a function
		expect(() => {
			// dismiss tab to trigger cleanup effect
			fireEvent.click(getByText(container, 'Dismiss'))
		}).not.toThrow()
	})

	it('should call updated cleanups', async () => {
		// start the app
		const { container } = startApp()

		// verify that the tab is rendered and the lock button is there
		expect(getByText(container, 'Was Locked: false')).toBeVisible()
		expect(getByText(container, 'Lock Tab')).toBeVisible()

		// wait for mutation observer to pick up new elements
		await waitFor(() => {})

		// dismiss tab to trigger cleanup effect
		fireEvent.click(getByText(container, 'Lock Tab'))

		// wait for mutation observer to pick up removed elements
		await waitFor(() => {})

		// verify that effect update was triggered
		expect(getByText(container, 'Was Locked: false')).toBeVisible()

		// dismiss tab to trigger cleanup effect
		fireEvent.click(getByText(container, 'Unlock Tab'))

		// wait for mutation observer to pick up removed elements
		await waitFor(() => {})

		// verify that effect update was triggered
		expect(getByText(container, 'Was Locked: true')).toBeVisible()
	})

	it('should process state as an array', async () => {
		// start the app
		const { container } = startApp()

		// previously when state was being processed, it would be converted to an object
		// this test adds an element to a store to verify array methods work

		// `push` a new element on to a store
		fireEvent.click(getByText(container, 'Add New Task'))

		// expect the element to appear in the app
		expect(getByText(container, 'Task Number 0')).toBeVisible()
	})

	it('should read the url state on loading the app', async () => {
		// previously when the app started, the incorrect url information was being retrieved by the hook

		// set the account in the url params
		window.history.pushState({}, '', '/test_account')

		// start the app
		const { container } = startApp()

		// verify the account info is read correctly at startup
		expect(getByText(container, 'Account: test_account')).toBeVisible()
	})
})
