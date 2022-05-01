const { getByText, queryAllByText, fireEvent, waitFor, getByLabelText } = require('@testing-library/dom');
const { default: userEvent } = require('@testing-library/user-event');
const { startApp } = require('./test-app');

describe('Tram-One', () => {
	it('should not call cleanups that are not functions', async () => {
		// start the app
		const { container } = startApp();

		// previously this would fail because the cleanup was called,
		// even though it was not a function, and instead was a promise (the result of an async function)
		// the fix was to do the same check we do in other places, to make sure cleanup is a function
		expect(() => {
			// dismiss tab to trigger cleanup effect
			fireEvent.click(getByText(container, 'Dismiss'));
		}).not.toThrow();
	});

	it('should call updated cleanups', async () => {
		// start the app
		const { container } = startApp();

		// verify that the tab is rendered and the lock button is there
		expect(getByText(container, 'Was Locked: false')).toBeVisible();
		expect(getByText(container, 'Lock Tab')).toBeVisible();

		// wait for mutation observer to pick up new elements
		await waitFor(() => {});

		// dismiss tab to trigger cleanup effect
		fireEvent.click(getByText(container, 'Lock Tab'));

		// wait for mutation observer to pick up removed elements
		await waitFor(() => {});

		// verify that effect update was triggered
		expect(getByText(container, 'Was Locked: false')).toBeVisible();

		// dismiss tab to trigger cleanup effect
		fireEvent.click(getByText(container, 'Unlock Tab'));

		// wait for mutation observer to pick up removed elements
		await waitFor(() => {});

		// verify that effect update was triggered
		expect(getByText(container, 'Was Locked: true')).toBeVisible();
	});

	it('should process state as an array', async () => {
		// start the app
		const { container } = startApp();

		// previously when state was being processed, it would be converted to an object
		// this test adds an element to a store to verify array methods work

		// `push` a new element on to a store
		fireEvent.click(getByText(container, 'Add New Task'));

		// expect the element to appear in the app
		expect(getByText(container, 'Task Number 0')).toBeVisible();
	});

	it('should read the url state on loading the app', async () => {
		// previously when the app started, the incorrect url information was being retrieved by the hook

		// set the account in the url params
		window.history.pushState({}, '', '/test_account');

		// start the app
		const { container } = startApp();

		// verify the account info is read correctly at startup
		expect(getByText(container, 'Account: test_account')).toBeVisible();
	});

	it('should keep focus on inputs when components would rerender', async () => {
		// start the app
		const { container } = startApp();

		// previously when interacting with an input, if the component would rerender
		// focus would be removed from the component and put on the body of the page

		// focus on the input
		userEvent.click(getByLabelText(container, 'New Task Label'));

		// verify that the element has focus (before we start changing text)
		await waitFor(() => {
			expect(getByLabelText(container, 'New Task Label')).toHaveFocus();
		});

		// clear the input
		userEvent.type(getByLabelText(container, 'New Task Label'), '{selectall}{backspace}');

		// wait for mutation observer to reapply focus
		await waitFor(() => {
			expect(getByLabelText(container, 'New Task Label')).toHaveFocus();
		});

		// update the state by typing
		userEvent.type(getByLabelText(container, 'New Task Label'), '0');

		// verify the element has the new value
		expect(getByLabelText(container, 'New Task Label')).toHaveValue('0');

		// wait for mutation observer to re-attach focus
		// expect the input to keep focus after the change event
		await waitFor(() => {
			expect(getByLabelText(container, 'New Task Label')).toHaveFocus();
		});
	});

	it('should keep focus on the most recent input when components rerender', async () => {
		// start the app
		const { container } = startApp();

		// previously when interacting with an input, if the component would rerender
		// focus would be removed from the component and put on the body of the page

		// focus on the first input
		userEvent.click(getByLabelText(container, 'New Task Label'));

		// focus on the second input
		userEvent.click(getByLabelText(container, 'New Task Type'));

		// verify that the element has focus (before we start changing text)
		await waitFor(() => {
			expect(getByLabelText(container, 'New Task Type')).toHaveFocus();
		});

		// clear the input
		userEvent.type(getByLabelText(container, 'New Task Type'), '{selectall}{backspace}');

		// wait for mutation observer to reapply focus
		await waitFor(() => {
			expect(getByLabelText(container, 'New Task Type')).toHaveFocus();
		});

		// update the state by typing
		userEvent.type(getByLabelText(container, 'New Task Type'), '0');

		// verify the element has the new value
		expect(getByLabelText(container, 'New Task Type')).toHaveValue('0');

		// wait for mutation observer to re-attach focus
		// expect the input to keep focus after the change event
		await waitFor(() => {
			expect(getByLabelText(container, 'New Task Type')).toHaveFocus();
		});
	});

	it('should keep focus when both the parent and child element would update', async () => {
		// start the app
		const { container } = startApp();

		// previously when interacting with an input, if both a parent and child element
		// would update, then focus would not reattach, and/or the value would not update correctly

		// focus on the parent input
		userEvent.click(getByLabelText(container, 'Mirror Input'));

		// verify that the element has focus (before we start changing text)
		await waitFor(() => {
			expect(getByLabelText(container, 'Mirror Input')).toHaveFocus();
		});

		// update the state by typing
		userEvent.type(getByLabelText(container, 'Mirror Input'), 'Test');

		// verify the element and it's child have the new value
		// the element should still have focus
		await waitFor(() => {
			expect(getByLabelText(container, 'Mirror Input')).toHaveFocus();
			expect(getByLabelText(container, 'Mirror Input')).toHaveValue('Test');
			expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test');
		});

		// repeat the test with the child element
		// focus on the child input
		userEvent.click(getByLabelText(container, 'Sub Mirror Input'));

		// verify that the element has focus (before we start changing text)
		await waitFor(() => {
			expect(getByLabelText(container, 'Sub Mirror Input')).toHaveFocus();
		});

		// update the state by typing
		userEvent.type(getByLabelText(container, 'Sub Mirror Input'), ' Again');

		// verify the element has the new value
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test Again');

		// verify the element and it's parent have the new value
		// the element should still have focus
		await waitFor(() => {
			expect(getByLabelText(container, 'Sub Mirror Input')).toHaveFocus();
			expect(getByLabelText(container, 'Mirror Input')).toHaveValue('Test Again');
			expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test Again');
		});
	});

	it('should not error when resetting focus if the number of elements changed', async () => {
		// start the app
		const { container } = startApp();

		// previously when interacting with an input, if the number of elements decreased
		// an error was thrown because the element to focus on no longer existed

		// focus on the child input
		userEvent.click(getByLabelText(container, 'Sub Mirror Input'));

		// verify that the element has focus (before we start changing text)
		await waitFor(() => {
			expect(getByLabelText(container, 'Sub Mirror Input')).toHaveFocus();
		});

		// update the state by typing
		userEvent.type(getByLabelText(container, 'Sub Mirror Input'), 'Test');

		// verify the element has the new value
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test');

		// verify the element and it's parent have the new value
		// also verify that the elements were added above it too (previously this would have failed)
		// the element should still have focus
		await waitFor(() => {
			expect(getByLabelText(container, 'Sub Mirror Input')).toHaveFocus();
			expect(queryAllByText(container, '-')).toHaveLength(4);
			expect(getByLabelText(container, 'Mirror Input')).toHaveValue('Test');
			expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test');
		});
	});

	it('should trigger use-effects of the first resolved element', async () => {
		// start the app
		startApp();

		// previously, useEffects on the first resolved element would not trigger
		// because the effect queue and effect store were pointed to the same object instance

		expect(document.title).toEqual('Tram-One Testing App');
	});

	it('should keep focus on inputs without a start and end selection', async () => {
		// start the app
		const { container } = startApp();

		// previously when interacting with an input of a different type (e.g. range)
		// when reapplying focus Tram-One would throw an error because while the
		// function for setting selection range exists, it does not work

		// focus on the input (the range input defaults to 0)
		userEvent.click(getByLabelText(container, 'Store Generator'));

		// verify that the element has focus (before we start changing text)
		await waitFor(() => {
			expect(getByLabelText(container, 'Store Generator')).toHaveFocus();
		});

		// hit the right arrow key to increment the value
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 1 } });
		// userEvent.type(getByLabelText(container, 'Store Generator'), '{arrowright}');

		// verify the element has the new value
		expect(getByLabelText(container, 'Store Generator')).toHaveValue('1');

		// wait for mutation observer to re-attach focus
		// expect the input to keep focus after the change event
		await waitFor(() => {
			expect(getByLabelText(container, 'Store Generator')).toHaveFocus();
		});
	});

	it('should clean up stores for elements that are no longer rendered', async () => {
		// start the app
		const { container } = startApp();

		// previously stores made for elements that had been removed stayed in the tram-observable-store

		// FOR JESSE, DEBUGGING NOTES:
		// window['tram-space']['tram-observable-store']
		// look at target, notice that it grows, even when the stores should have been removed
	});
});
