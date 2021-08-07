const { registerHtml, start } = require('../../src/tram-one')

const html = registerHtml({
	'title': require('./title'),
})

/**
 * main app to power integration tests
 */
const app = () => {
	return html`
		<main>
			<title />
		</main>
	`
}

const startApp = container => {
	if (container === undefined) {
		container = document.createElement('div')
		container.id = 'app'
	}

	start(app, container)

	return {
		container
	}
}

if (document.querySelector('#parcel-page')) {
	startApp('#parcel-page')
}

module.exports = {
	app, startApp
}
