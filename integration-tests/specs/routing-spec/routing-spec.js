const serverSpec = require('../../test-utilities/setup-server')
const elementExists = require('../../test-utilities/element-exists')

module.exports = () => {
	return serverSpec('routing spec', __dirname, async (nightmare, host) => {
		const results = []

		// start electron instance and tests on the page
		await nightmare
			.goto(`${host}#A`)
			.exists('#page-a')
			.then(pageAExists => elementExists(pageAExists, 'page A', results))

		await nightmare
			.goto(`${host}#B`)
			.exists('#page-b')
			.then(pageBExists => elementExists(pageBExists, 'page B', results))

		await nightmare
			.goto(`${host}?count=4`)
			.exists('#count-link[count="4"]')
			.then(countLinkExists => elementExists(countLinkExists, 'count link (count = 4)', results))

		await nightmare
			.goto(`${host}?count=4`)
			.click('#count-link')
			.exists('#count-link[count="5"]')
			.then(countLinkExists => elementExists(countLinkExists, 'count link (count = 5)', results))

		return results
	})
}
