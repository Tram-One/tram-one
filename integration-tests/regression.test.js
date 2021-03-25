const { getByText, fireEvent, waitFor, getByLabelText, getByDisplayValue, wait } = require('@testing-library/dom')
const { default: userEvent } = require('@testing-library/user-event')
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

	it('should keep focus on inputs when components would rerender', async () => {
		// for focus to work correctly, the element needs to be attached to the document
		const appContainer = document.createElement('div')
		appContainer.id = 'app'
		window.document.body.appendChild(appContainer)

		// start the app using a css selector
		startApp('#app')

		// previously when interacting with an input, if the component would rerender
		// focus would be removed from the component and put on the body of the page

		// focus on the input
		userEvent.click(getByLabelText(appContainer, 'New Task Label'))

		// verify that the element has focus (before we start changing text)
		await waitFor(() => {
			// expect(document.activeElement).toBe(inputElement)
			expect(getByLabelText(appContainer, 'New Task Label')).toHaveFocus();
		})

		// clear the input
		userEvent.type(getByLabelText(appContainer, 'New Task Label'), '{selectall}{backspace}')

		// wait for mutation observer to reapply focus
		await waitFor(() => {
			expect(getByLabelText(appContainer, 'New Task Label')).toHaveFocus();
		})

		// update the state by typing
		userEvent.type(getByLabelText(appContainer, 'New Task Label'), '0')

		// verify the element has the new value
		expect(getByLabelText(appContainer, 'New Task Label')).toHaveValue('0')

		// wait for mutation observer to re-attach focus
		// expect the input to keep focus after the change event
		await waitFor(() => {
			expect(getByLabelText(appContainer, 'New Task Label')).toHaveFocus();
		})
	})
})
