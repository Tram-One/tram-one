import { TramOneComponent } from './types';
import { registerDom } from './dom';
import useEffect from './use-effect';

const xml = registerDom(null);

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
	return xml`<tram-fragment>${children}</tram-fragment>`;
};

export default fragment;
