import { registerDom } from '../dom';

const html = registerDom();

export const listItem = (props, children) => {
	return html`
		<li id=${props.id}>
			${children}
			<button onclick=${props.onremove}>X</button>
		</li>
	`;
};
