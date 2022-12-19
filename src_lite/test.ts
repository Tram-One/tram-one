import { registerDom } from './dom';
import mount from './mount';

const html = registerDom();
const app = (props) => {
	const incrementCounter = () => {
		props.count = parseInt(props.count || '0') + 1;
	};

	const onUpdateCounter = (event) => {
		event.target.innerHTML = event.target.getAttribute('count');
	};

	const updateList = (keyEvent) => {
		if (keyEvent.charCode === 13) {
			const newElement = keyEvent.target.value;
			const elementsAttr = props.elements;
			const elements = (elementsAttr && elementsAttr?.split(' | ')) || [];
			props.elements = elements.concat([newElement]).join(' | ');
			keyEvent.target.value = '';
		}
	};

	const onUpdateList = (event) => {
		const elementsAttr = props.elements;
		const elements = elementsAttr.split(' | ').filter((element) => element);
		elements.forEach((element) => {
			const elementId = element.replaceAll(/[^A-Za-z1-9 -]/g, '').replaceAll(/\s/g, '-');
			if (!event.target.querySelector(`#${elementId}`)) {
				const liElement = html`<li id=${elementId}>${element}</li>`;
				event.target.appendChild(liElement);
			}
		});
	};

	return html`
		<main>
			<h1>To Do List!</h1>
			<button count="0" onclick=${incrementCounter} onupdate=${onUpdateCounter}></button>
			<input onkeypress=${updateList} />
			<ol elements="" onupdate=${onUpdateList}></ol>
		</main>
	`;
};

mount(app, document.body);
