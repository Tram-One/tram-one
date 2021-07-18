const { registerHtml, start } = require('../../src/tram-one')

const html = registerHtml({
	'title': require('./title'),
	'logo': require('./logo'),
	'click-tracker': require('./click-tracker'),
	'startup-wait': require('./startup-wait'),
	'tab': require('./tab'),
	'account': require('./account'),
	'tasks': require('./tasks'),
	'mirror-input': require('./mirror-input')
})

/**
 * main app to power integration tests
 */
const app = () => {
	return html`
		<main>
			<title subtitle="Sub Title Prop">Sub Title Child</title>
			<logo />
			<account />
			<p>Test Page Content</p>
			<click-tracker />
			<startup-wait />
			<tab />
			<tasks />
			<mirror-input />
		</main>
	`
}

const startApp = container => {
	let appContainer = container
	if (!appContainer) {
		// before we setup the app, cleanup the document state if this was called before
		const previousApp = document.querySelector('#app')
		if (previousApp) previousApp.remove()

		// setup the container for the app
		appContainer = document.createElement('div')
		appContainer.id = 'app'

		// attach the container to the document
		// this is required, since focus and visibility checks depend on being in the document
		window.document.body.appendChild(appContainer)
	}

	start(app, appContainer)

	return {
		container: appContainer
	}
}

if (document.querySelector('#parcel-page')) {
	startApp('#parcel-page')
}

module.exports = {
	app, startApp
}
