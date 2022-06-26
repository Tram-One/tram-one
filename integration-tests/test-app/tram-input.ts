import { registerHtml, useEffect, TramOneComponent } from '../../src/tram-one';

const html = registerHtml();

/**
 * Element to test useEffect reference point
 */
const tramInput: TramOneComponent = () => {
	useEffect((ref) => {
		(ref as unknown as HTMLElement).focus();
	});
	return html`<input placeholder="Input for automatic focus" />`;
};

export default tramInput;
