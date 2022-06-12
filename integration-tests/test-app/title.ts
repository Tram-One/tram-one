import { registerHtml, TramOneComponent } from '../../src/tram-one';
import subtitle from './sub-title';

const html = registerHtml({
	// sub-title to test multiple instances of the same tag
	'sub-title': subtitle,
});

/**
 * component to test basic rendering
 */
const title: TramOneComponent = ({ subtitle }, children) => {
	return html`
		<header>
			<h1 class="title">Home Page</h1>
			<sub-title>${children}</sub-title>
			<sub-title>${subtitle}</sub-title>
		</header>
	`;
};

export default title;
