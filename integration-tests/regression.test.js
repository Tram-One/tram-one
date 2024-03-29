const { getByText, queryAllByText, fireEvent, waitFor, getByLabelText, queryByText } = require('@testing-library/dom');
const { default: userEvent } = require('@testing-library/user-event');
const { startAppAndWait } = require('./test-helpers');

/**
 * The following suite of tests are made retroactively for unexpected behaviors.
 * They are not for any direct feature, but rather validate the behavior of framework as a whole.
 */

describe('Tram-One', () => {
	it('should not call cleanups that are not functions', async () => {
		// start the app
		const { container } = await startAppAndWait();

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
		const { container } = await startAppAndWait();

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
		const { container } = await startAppAndWait();

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
		const { container } = await startAppAndWait();

		// verify the account info is read correctly at startup
		expect(getByText(container, 'Account: test_account')).toBeVisible();
	});

	it('should keep focus on inputs when components would rerender', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// previously when interacting with an input, if the component would rerender
		// focus would be removed from the component and put on the body of the page

		// focus on the input
		await userEvent.click(getByLabelText(container, 'New Task Label'));

		// verify that the element has focus (before we start changing text)
		expect(getByLabelText(container, 'New Task Label')).toHaveFocus();

		// clear the input
		await userEvent.clear(getByLabelText(container, 'New Task Label'));

		// verify the element still has focus (before typing)
		expect(getByLabelText(container, 'New Task Label')).toHaveFocus();

		// update the state by typing
		await userEvent.type(getByLabelText(container, 'New Task Label'), '0');

		// verify the element has the new value
		expect(getByLabelText(container, 'New Task Label')).toHaveValue('0');

		// expect the input to keep focus after the change event
		expect(getByLabelText(container, 'New Task Label')).toHaveFocus();
	});

	it('should keep focus on the most recent input when components rerender', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// previously when interacting with an input, if the component would rerender
		// focus would be removed from the component and put on the body of the page

		// focus on the first input
		await userEvent.click(getByLabelText(container, 'New Task Label'));

		// focus on the second input
		await userEvent.click(getByLabelText(container, 'New Task Type'));

		// verify that the element has focus (before we start changing text)
		expect(getByLabelText(container, 'New Task Type')).toHaveFocus();

		// clear the input
		await userEvent.clear(getByLabelText(container, 'New Task Type'));

		// verify we didn't lose
		expect(getByLabelText(container, 'New Task Type')).toHaveFocus();

		// update the state by typing
		await userEvent.type(getByLabelText(container, 'New Task Type'), '0');

		// verify the element has the new value
		expect(getByLabelText(container, 'New Task Type')).toHaveValue('0');

		// expect the input to keep focus after the change event
		expect(getByLabelText(container, 'New Task Type')).toHaveFocus();
	});

	it('should keep focus when both the parent and child element would update', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// previously when interacting with an input, if both a parent and child element
		// would update, then focus would not reattach, and/or the value would not update correctly

		// focus on the parent input
		await userEvent.click(getByLabelText(container, 'Mirror Input'));

		// verify that the element has focus (before we start changing text)
		expect(getByLabelText(container, 'Mirror Input')).toHaveFocus();

		// update the state by typing
		await userEvent.type(getByLabelText(container, 'Mirror Input'), 'Test');

		// verify the element and it's child have the new value
		// the element should still have focus
		expect(getByLabelText(container, 'Mirror Input')).toHaveFocus();
		expect(getByLabelText(container, 'Mirror Input')).toHaveValue('Test');
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test');

		// repeat the test with the child element
		// focus on the child input
		await userEvent.click(getByLabelText(container, 'Sub Mirror Input'));

		// verify that the element has focus (before we start changing text)
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveFocus();

		// update the state by typing
		await userEvent.type(getByLabelText(container, 'Sub Mirror Input'), ' Again');

		// verify the element has the new value
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test Again');

		// verify the element and it's parent have the new value
		// the element should still have focus
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveFocus();
		expect(getByLabelText(container, 'Mirror Input')).toHaveValue('Test Again');
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test Again');
	});

	it('should not error when resetting focus if the number of elements changed', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// previously when interacting with an input, if the number of elements decreased
		// an error was thrown because the element to focus on no longer existed

		// focus on the child input
		await userEvent.click(getByLabelText(container, 'Sub Mirror Input'));

		// verify that the element has focus (before we start changing text)
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveFocus();

		// update the state by typing
		await userEvent.type(getByLabelText(container, 'Sub Mirror Input'), 'Test');

		// verify the element has the new value
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test');

		// verify the element and it's parent have the new value
		// also verify that the elements were added above it too (previously this would have failed)
		// the element should still have focus
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveFocus();
		expect(queryAllByText(container, '-')).toHaveLength(4);
		expect(getByLabelText(container, 'Mirror Input')).toHaveValue('Test');
		expect(getByLabelText(container, 'Sub Mirror Input')).toHaveValue('Test');
	});

	it('should trigger use-effects of the first resolved element', async () => {
		// start the app
		await startAppAndWait();

		// previously, useEffects on the first resolved element would not trigger
		// because the effect queue and effect store were pointed to the same object instance

		expect(document.title).toEqual('Tram-One Testing App');
	});

	it('should keep focus on inputs without a start and end selection', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// previously when interacting with an input of a different type (e.g. range)
		// when reapplying focus Tram-One would throw an error because while the
		// function for setting selection range exists, it does not work

		// focus on the input (the range input defaults to 0)
		await userEvent.click(getByLabelText(container, 'Store Generator'));

		// verify that the element has focus (before changing the value)
		expect(getByLabelText(container, 'Store Generator')).toHaveFocus();

		// change the value of the input
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 1 } });

		// verify the element has the new value
		expect(getByLabelText(container, 'Store Generator')).toHaveValue('1');

		// wait for mutation observer to re-attach focus
		// expect the input to keep focus after the change event
		await waitFor(() => {
			expect(getByLabelText(container, 'Store Generator')).toHaveFocus();
		});
	});

	it('should not reset stores for elements that are still rendered', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// previously state would be blown away if a parent element changed state multiple times

		// focus on the input (the range input defaults to 0)
		await userEvent.click(getByLabelText(container, 'Store Generator'));

		// change the value of the input
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 1 } });

		// click on one of the new stores several times
		await userEvent.click(getByText(container, '[0: 0]'));
		await userEvent.click(getByText(container, '[0: 1]'));
		await userEvent.click(getByText(container, '[0: 2]'));
		await userEvent.click(getByText(container, '[0: 3]'));
		// the button should now say "[0: 4]"
		expect(getByText(container, '[0: 4]')).toBeVisible();

		// update the number of stores (the parent store element)
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 2 } });

		// wait for mutation observer clean up removed stores
		await waitFor(() => {
			// we should see the new buttons
			expect(getByText(container, '[1: 0]')).toBeVisible();
		});
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 3 } });
		// wait for mutation observer clean up removed stores
		await waitFor(() => {
			// we should see the new buttons
			expect(getByText(container, '[2: 0]')).toBeVisible();
		});

		// we should still see the button with "4,"
		expect(getByText(container, '[0: 4]')).toBeVisible();
	});

	it('should reset stores for elements that have been removed', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// previously we would hold on to the local state of elements even if they had been removed

		// focus on the input (the range input defaults to 0)
		await userEvent.click(getByLabelText(container, 'Store Generator'));

		// change the value of the input
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 5 } });

		// expect to see all the stores with their initial values
		await waitFor(() => {
			expect(getByText(container, '[0: 0]')).toBeVisible();
			expect(getByText(container, '[1: 0]')).toBeVisible();
			expect(getByText(container, '[2: 0]')).toBeVisible();
			expect(getByText(container, '[3: 0]')).toBeVisible();
			expect(getByText(container, '[4: 0]')).toBeVisible();
		});

		// click on each of the new stores
		await userEvent.click(getByText(container, '[0: 0]'));
		await userEvent.click(getByText(container, '[1: 0]'));
		await userEvent.click(getByText(container, '[2: 0]'));
		await userEvent.click(getByText(container, '[3: 0]'));
		await userEvent.click(getByText(container, '[4: 0]'));

		// expect to see all the stores with the new values
		expect(getByText(container, '[0: 1]')).toBeVisible();
		expect(getByText(container, '[1: 1]')).toBeVisible();
		expect(getByText(container, '[2: 1]')).toBeVisible();
		expect(getByText(container, '[3: 1]')).toBeVisible();
		expect(getByText(container, '[4: 1]')).toBeVisible();

		// remove all of the stores by setting the value to 0
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 0 } });

		await waitFor(() => {
			expect(queryByText(container, '[0: 1]')).toBe(null);
			expect(queryByText(container, '[1: 1]')).toBe(null);
			expect(queryByText(container, '[2: 1]')).toBe(null);
			expect(queryByText(container, '[3: 1]')).toBe(null);
			expect(queryByText(container, '[4: 1]')).toBe(null);
		});

		// re-add the stores by setting the value to 5
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 5 } });

		// expect to see all the stores with their initial values
		await waitFor(() => {
			expect(getByText(container, '[0: 0]')).toBeVisible();
			expect(getByText(container, '[1: 0]')).toBeVisible();
			expect(getByText(container, '[2: 0]')).toBeVisible();
			expect(getByText(container, '[3: 0]')).toBeVisible();
			expect(getByText(container, '[4: 0]')).toBeVisible();
		});
	});

	it('should process effects of components that return other components at root', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// previously if an element immediately returned another component,
		// the effects of the child component would be lost

		// verify that effects were trigged
		expect(window.location.hash).toBe('#testing');
		expect(getByText(container, 'Anchor Set - effect triggered: true')).toBeVisible();
	});
});
