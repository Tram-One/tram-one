import { registerHtml, TramOneComponent } from '../../src/tram-one';
import fragment from '../../src/fragment';

const html = registerHtml({
	fr: fragment,
});

/**
 * Test with fragment element
 */
const fragmentList: TramOneComponent = () => {
	return html`<fr>
		<li>Test 1</li>
		<li>Test 2</li>
		<li>Test 3</li>
	</fr>`;
};

export default fragmentList;
