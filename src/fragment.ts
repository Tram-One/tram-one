import { TramOneComponent } from './types';
import { registerHtml } from './dom-wrappers';
import useEffect from './use-effect';

const html = registerHtml();

const fragment: TramOneComponent = (props, children) => {
	useEffect((ref) => {
		const parent = ref.parentElement;
		const fragmentChildren = ref.childNodes;
		const childCopies = [...fragmentChildren];
		parent?.append(...childCopies);
	});
	return html`<tram-fragment>${children}</tram-fragment>`;
};

export default fragment;
