const { getByTestId, fireEvent, wait } = require('@testing-library/dom')
const { start, registerHtml } = require('../src/tram-one')

const { globalCounter, graphic, home, loadingPage, loading, removablePage, removable, updatablePage, updatable, updatedEffect, urlLabel } = require('./mock-components')

const html = registerHtml({
	globalCounter, graphic, home, loadingPage, loading, removablePage, removable, updatablePage, updatable, updatedEffect, urlLabel
})

describe('Tram-One', () => {
	it('should render on a Node', () => {
		// mount the app on the container
		const container = document.createElement('div')
		start(container, home)

		// verify that the home page is rendered
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Home Page')
	})

	it('should render on the window with a selector', () => {
		const appContainer = document.createElement('div')
		appContainer.id = 'app'

		window.document.body.appendChild(appContainer)

		start('#app', home)

		// verify that the home page is rendered
		expect(getByTestId(document, 'home-page')).toHaveTextContent('Home Page')

		// cleanup - remove app
		appContainer.remove()
	})

	it('should warn if selector is not found', () => {
		const originalError = console.error
		console.error = jest.fn()
		start('#app', home)

		// verify that the console warning occured
		expect(console.error).toHaveBeenCalledWith('Tram-One: could not find target, is the element on the page yet?')

		// cleanup - reset console.error
		console.error = originalError
	})

	it('should render html from registry', () => {
		// mount the app on the container
		const container = document.createElement('div')
		const homeWithButton = () => html`<home><updatable /></home>`
		start(container, homeWithButton)

		// verify that the home page is rendered with a button
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Home Page')
		expect(getByTestId(container, 'updatable-button')).toHaveTextContent('0')
	})

	it('should render svg graphics', () => {
		// mount the app on the container
		const container = document.createElement('div')
		start(container, graphic)

		// verify that the home page is rendered
		expect(getByTestId(container, 'graphic-circle')).toBeTruthy()
	})

	it('should update components on observer updates', () => {
		// mount the app on the container
		const container = document.createElement('div')
		start(container, updatable)

		// verify the button exists with the default value
		expect(getByTestId(container, 'updatable-button')).toHaveTextContent('0')

		// click on the button
		fireEvent.click(getByTestId(container, 'updatable-button'))

		// verify the button updated with the new value
		expect(getByTestId(container, 'updatable-button')).toHaveTextContent('1')
	})

	it('should process effects on mount', async () => {
		// mount the app on the container
		const container = document.createElement('div')
		const homeWithLoader = () => html`<home><loading /></home>`
		start(container, homeWithLoader)

		// verify that the home page is rendered
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Home Page')

		// verify that it has the loading text
		expect(getByTestId(container, 'home-page')).toHaveTextContent('loading')

		// wait for mutation observer to pick up new elements
		await wait()

		// verify that it (eventually) has the finished text
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Finished')
	})

	it('should process cleanup effects', async () => {
		// mount the app on the container
		const container = document.createElement('div')
		start(container, removablePage)

		// verify that the home page is rendered and the removable element is there
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Remove not triggered')
		expect(getByTestId(container, 'removable-element')).toHaveTextContent('Removable')

		// wait for mutation observer to pick up new elements
		await wait()

		// trigger removal
		fireEvent.click(getByTestId(container, 'hide-removable'))

		// wait for mutation observer to pick up removed elements
		await wait()

		// verify that the element was removed
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Remove was triggered')
	})

	it('should process nested component effects', async () => {
		// mount the app on the container
		const container = document.createElement('div')
		start(container, loadingPage)

		// verify the home page is there, and we haven't loaded or fetched
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Fetching...')
		expect(getByTestId(container, 'loader')).toHaveTextContent('loading...')
		expect(getByTestId(container, 'loader')).toHaveTextContent('loading2...')

		// wait for mutation observer to pick up new elements
		await wait()

		// verify both elements were updated
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Finished Fetching!')
		expect(getByTestId(container, 'loader')).toHaveTextContent('Finished loading!')
		expect(getByTestId(container, 'loader')).toHaveTextContent('Finished loading2!')
	})

	it('should share state in a global store', async () => {
		// mount the app on the container
		const container = document.createElement('div')
		const homeWithGlobalCounters = () => {
			return html`
				<home>
					<globalCounter testId="global-counter-0" />
					<globalCounter testId="global-counter-1" />
				</home>
			`
		}

		start(container, homeWithGlobalCounters)

		// verify the home page is there with 2 couters at 0
		expect(getByTestId(container, 'global-counter-0')).toHaveTextContent('0')
		expect(getByTestId(container, 'global-counter-1')).toHaveTextContent('0')

		// increment one of the global counters
		fireEvent.click(getByTestId(container, 'global-counter-0'))

		// verify both counters updated
		expect(getByTestId(container, 'global-counter-0')).toHaveTextContent('1')
		expect(getByTestId(container, 'global-counter-1')).toHaveTextContent('1')
	})

	it('should re-render components dependent on url params', () => {
		// mount the app on the container
		const container = document.createElement('div')
		const homeWithColorLabel = () => {
			return html`
				<home>
					<urlLabel />
				</home>
			`
		}

		start(container, homeWithColorLabel)

		// verify the color label appears on the page
		expect(getByTestId(container, 'color-label')).toBeTruthy()

		// set the url to /blue
		window.history.pushState({}, '', '/color/blue')

		// verify the color label appears with the property
		expect(getByTestId(container, 'color-label')).toHaveTextContent('blue')

		// change the url to be /red
		window.history.pushState({}, '', '/color/red')

		// verify the color label is updated
		expect(getByTestId(container, 'color-label')).toHaveTextContent('red')

		// set the url to a non-matching route
		window.history.pushState({}, '', '/test')

		// verify the color label is blank
		expect(getByTestId(container, 'color-label')).toHaveTextContent('')
	})

	it('should call effects on remount', async () => {
		// mount the app on the container
		const container = document.createElement('div')
		start(container, updatablePage)

		// verify the page is mounted with default values
		expect(getByTestId(container, 'updatable-button')).toHaveTextContent('5')

		// let effects process
		await wait()

		// verify the title is the default value
		expect(document.title).toBe('The count is 5')

		// click on the top level button (that updates the props)
		fireEvent.click(getByTestId(container, 'increment-count'))

		// let effects process
		await wait()

		// verify the page and title updated
		expect(getByTestId(container, 'updatable-button')).toHaveTextContent('6')
		expect(document.title).toBe('The count is 6')

		// click on the inner component (that updates the component's state)
		fireEvent.click(getByTestId(container, 'updatable-button'))

		// let effects process
		await wait()

		// verify the page and title updated
		expect(getByTestId(container, 'updatable-button')).toHaveTextContent('7')
		expect(document.title).toBe('The count is 7')
	})

	it('should call updated cleanups', async () => {
		// mount the app on the container
		const container = document.createElement('div')
		start(container, updatablePage)

		// verify the page is mounted with default values
		expect(getByTestId(container, 'updatable-button')).toHaveTextContent('5')

		// let effects process
		await wait()

		// verify the title is the default value
		expect(document.title).toBe('The count is 5')

		// click on the inner component (that updates the component's state)
		fireEvent.click(getByTestId(container, 'updatable-button'))

		// let effects process
		await wait()

		// verify the page and title updated
		expect(getByTestId(container, 'updatable-button')).toHaveTextContent('6')
		expect(document.title).toBe('The count is 6')

		// click on the remove button to trigger cleanup
		fireEvent.click(getByTestId(container, 'remove-count'))

		// let effects process
		await wait()

		// verify the page and title updated
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Counter Removed')
		expect(document.title).toBe('The count was 6')
	})

	it('should render a page with a pre-configured global', () => {
		global.tramSpace = {}

		// mount the app on the container
		const container = document.createElement('div')
		start(container, updatablePage)

		// verify that the home page is rendered
		expect(getByTestId(container, 'home-page')).toHaveTextContent('Home Page')

		// verify that the global tramSpace was used
		const keys = Object.keys(global.tramSpace)
		expect(keys.length).toBeGreaterThan(0)
	})
})
