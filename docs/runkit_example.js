// NOTE: This won't work since Tram-One does not (right now) support server-side rendering
// This is on our backlog though, and if it is something that you would like, please vote / comment here:
// https://github.com/Tram-One/tram-one/issues/181

const { registerHtml } = require('tram-one');

const html = registerHtml();
const home = () => {
	return html`
		<main>
			<h1>Tram-One</h1>
			<h2>A Modern View Framework for Vanilla Javascript</h2>
		</main>
	`;
};

home().outerHTML;
