import { TramOneComponent } from './types';
import { registerHtml } from './dom-wrappers';
import useEffect from './use-effect';

const html = registerHtml();

const fragment: TramOneComponent = (props, children) => {
	useEffect((ref) => {
		(children || []).forEach((child) => {
			if (typeof child === 'string') {
				ref.insertAdjacentText('beforebegin', child);
			} else {
				ref.insertAdjacentElement('beforebegin', child);
			}
		});
		ref.remove();
	});
	return html`<tram-fragment>${children}</tram-fragment>`;
};

export default fragment;
