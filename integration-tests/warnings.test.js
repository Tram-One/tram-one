const { startApp } = require('./test-app');
const { startApp: startBrokenApp } = require('./broken-app');

/*
 * These tests represent runtime errors that can't be type checked
 * Ideally these will eventually be statically checked by some linter,
 * but for now this is the best way to verify the behavior is what we expect.
 */

describe('Tram-One', () => {
	it('should warn if selector is not found', () => {
		expect(() => startApp('#app')).toThrowError('Tram-One: could not find target, is the element on the page yet?');
	});

	it('should warn if a hook is called outside of a component context', () => {
		expect(() => startBrokenApp('hook')()).toThrowError(
			'Tram-One: app has not started yet, but hook was called. Is it being invoked outside a component function?'
		);
	});
});
