import { registerHtml, useEffect, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * Element to test useEffect reference point
 */
const focusInput: TramOneComponent = () => {
	useEffect((ref) => {
		ref.focus();
	});
	return html`<input placeholder="Input for automatic focus" />`;
};

export default focusInput;
