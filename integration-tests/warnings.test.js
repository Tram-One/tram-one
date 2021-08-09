const { startApp } = require('./test-app')
const { startApp: startBrokenApp } = require('./broken-app')

describe('Tram-One', () => {
	beforeEach(() => {
		// clean up any tram-one properties between tests
		window['tram-space'] = undefined
	})

	it('should warn if selector is not found', () => {
		expect(() => startApp('#app')).toThrowError('Tram-One: could not find target, is the element on the page yet?')
	})

	it('should warn if a component does not return anything', () => {
		expect(() => startBrokenApp('empty')()).toThrowError('Tram-One: expected component to return an Element, instead got undefined. Verify the component is a function that returns DOM.')
	})

	it('should warn if a component does not return an element', () => {
		expect(() => startBrokenApp('non-dom')()).toThrowError('Tram-One: expected component to return an Element, instead got string. Verify the component is a function that returns DOM.')
	})

	it('should warn if a component returns an array', () => {
		expect(() => startBrokenApp('array')()).toThrowError('Tram-One: Sorry, Tram-One does not currently support array returns. Wrap components in an element before returning.')
	})

	it('should warn if a hook is called outside of a component context', () => {
		expect(() => startBrokenApp('hook')()).toThrowError('Tram-One: app has not started yet, but hook was called. Is it being invoked outside a component function?')
	})
})
