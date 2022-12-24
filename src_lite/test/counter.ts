import { registerDom } from '../dom';

const html = registerDom();

export const counter = (props) => {
	const incrementCounter = () => {
		props.count = parseInt(props.count || '0') + 1;
	};

	const onUpdateCounter = (event) => {
		// event.target.innerHTML = props.count;
		event.target.innerHTML = event.target.getAttribute('count');
	};

	return html`<button count="0" onclick=${incrementCounter} onupdate=${onUpdateCounter}></button>`;
};
