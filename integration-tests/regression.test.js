const { getByTestId, fireEvent, wait } = require('@testing-library/dom')
const { start } = require('../src/tram-one')

const { updatablePromisePage, conflictingGlobalCounter } = require('./mock-components')

describe('Tram-One - regressions', () => {
	it('should not call cleanups that are not functions', async () => {
		// mount the app on the container
		const container = document.createElement('div')
		start(container, updatablePromisePage)

		// verify the page is mounted with default values
		expect(getByTestId(container, 'updatable-button')).toHaveTextContent('5')

		// let effects process
		await wait()

		// verify the title is the default value
		expect(document.title).toBe('The count is 5')

		// previously this would fail because the cleanup was called,
		// even though it was not a function, and instead was a promise (the result of an async function)
		// the fix was to do the same check we do in other places, to make sure cleanup is a function
		expect(() => {
			// click on the inner component (that updates the component's state)
			fireEvent.click(getByTestId(container, 'updatable-button'))
		}).not.toThrow()
	})

	it('should not overwrite an observable with undefined', () => {
		// mount the app on the container
		const container = document.createElement('div')
		start(container, conflictingGlobalCounter)

		// verify that the page is mounted with the correct values
		expect(getByTestId(container, 'global-counter')).toHaveTextContent('5')
		expect(getByTestId(container, 'global-counter-2')).toHaveTextContent('5')
	})
})
