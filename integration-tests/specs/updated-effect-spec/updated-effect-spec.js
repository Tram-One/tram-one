const serverSpec = require('../../test-utilities/setup-server')
const isTrue = require('../../test-utilities/is-true')

module.exports = () => {
	return serverSpec('updated-effect spec', __dirname, async (nightmare, host) => {
		const results = []

		// start electron instance and tests on the page
		await nightmare
			.goto(host)
			.type('#title-input', 'Tram One Rules!')
			.evaluate(() => document.title)
			.then(title => isTrue(title, 'title', 'Tram One Rules!', results))

		await nightmare
			.goto(host)
			.type('#title-input', 'Tram One Rules!')
			.type('#title-input')
			.type('#title-input', 'Tram One is Cool')
			.type('#title-input')
			.type('#title-input', 'Tram One Rules!')
			.evaluate(() => document.title)
			.then(title => isTrue(title, 'title', 'Tram One Rules!', results))

		return results
	})
}
