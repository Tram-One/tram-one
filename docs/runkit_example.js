const { registerHtml } = require('tram-one')

const html = registerHtml()
const home = () => {
	return html`
		<main>
			<h1> Tram-One </h1>
			<h2> A Modern View Framework for Vanilla Javascript </h2>
		</main>
	`
}

home().outerHTML
