const { queryByText, fireEvent, waitFor, getByLabelText } = require('@testing-library/dom');
const { default: userEvent } = require('@testing-library/user-event');
const { startAppAndWait } = require('./test-helpers');

/**
 * The following suite of tests verify the behavior of the internals of Tram-One, more so than other tests might.
 * They are often inpercievable to end-users, and verify the expected behavior of the behind-the-scenes design.
 */

describe('Tram-One', () => {
	it('should clean up stores for elements that are no longer rendered', async () => {
		// start the app
		const { container } = await startAppAndWait();

		// previously stores made for elements that had been removed stayed in the tram-observable-store

		const initialStores = Object.keys(window['tram-space']['tram-observable-store']);

		// focus on the input (the range input defaults to 0)
		userEvent.click(getByLabelText(container, 'Store Generator'));

		// change the value of the input
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 1 } });

		await waitFor(() => {
			// make sure the new control is in the document
			// (additionally, we're doing this to make sure that all the mutation observers have had a chance to catch up)
			expect(queryByText(container, '[0: 0]')).toBeVisible();
		});

		// expect us to have one additional store now
		const postChangeStores = Object.keys(window['tram-space']['tram-observable-store']);
		expect(postChangeStores.length).toBe(initialStores.length + 1);

		// change the value of the input back to 0
		fireEvent.change(getByLabelText(container, 'Store Generator'), { target: { value: 0 } });

		await waitFor(() => {
			// make sure the new control is in the document
			// (additionally, we're doing this to make sure that all the mutation observers have had a chance to catch up)
			expect(queryByText(container, '[0: 0]')).toBe(null);
		});

		// wait for mutation observer clean up removed stores
		await waitFor(() => {
			const postChangeStoresTwo = Object.keys(window['tram-space']['tram-observable-store']);
			// check that the lists are the same (they may have shuffled, so sort them)
			expect(postChangeStoresTwo.sort()).toEqual(initialStores.sort());
		});
	});

	it('should not have recursive working-key branches', async () => {
		// start the app
		await startAppAndWait();

		// previously the working branch indices would have long recursive chains of branches
		const workingKeyBranches = Object.keys(window['tram-space']['tram-hook-key'].branchIndices);

		// verify that top-level elements exist
		expect(workingKeyBranches).toEqual(expect.arrayContaining(['app[{}]']));
		expect(workingKeyBranches).toEqual(expect.arrayContaining(['app[{}]/logo[{}]']));
		expect(workingKeyBranches).toEqual(expect.arrayContaining(['app[{}]/tab[{}]']));

		// verify that no element contains a duplicate of 'app[{}]' - this indicates an issue with the key generation
		workingKeyBranches.forEach((branch) => {
			expect(branch).not.toMatch(/app\[\{\}\].*app\[\{\}\]/);
		});
	});
});
