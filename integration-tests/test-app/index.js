const { registerHtml, start } = require('../../src/tram-one')

const html = registerHtml({
	'title': require('./title'),
	'logo': require('./logo'),
	'click-tracker': require('./click-tracker'),
	'startup-wait': require('./startup-wait'),
	'tab': require('./tab'),
	'account': require('./account')
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

module.exports = {
	app, startApp
}
