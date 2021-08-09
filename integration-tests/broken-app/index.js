const { registerHtml, start } = require('../../src/tram-one')

const buildApp = test => {
	// build the html function on the spot
	// we have to do this because some components cause the page to break on import
	const html = registerHtml({
		'test-component': require(`./broken-${test}`)
	})

	/**
	 * main app to power integration tests
	 */
	return () => html`
		<main>
			<test-component />
		</main>
	`
}

const startApp = test => container => {
	if (container === undefined) {
		container = document.createElement('div')
		container.id = 'app'
	}

	start(buildApp(test), container)

	return {
		container
	}
}

module.exports = {
	startApp
}
