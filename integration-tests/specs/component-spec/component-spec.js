const serverSpec = require('../../test-utilities/setup-server')
const elementExists = require('../../test-utilities/element-exists')

module.exports = () => {
	return serverSpec('custom component spec', __dirname, async (nightmare, host) => {
		const results = []

		// start electron instance and tests on the page
		await nightmare
			.goto(host)
			.exists('.custom-header')
			.then(headerExists => elementExists(headerExists, 'custom header', results))

		return results
	})
}
