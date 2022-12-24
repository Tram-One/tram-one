import { registerDom } from '../dom';
import mount from '../mount';

import { listItem } from './list-item';
import { counter } from './counter';

const html = registerDom({
	'list-item': listItem,
	counter: counter,
});
const app = (props) => {
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
			const onRemove = props.elements.split(' | ').filter((curElement) => curElement != element);
			if (!event.target.querySelector(`#${elementId}`)) {
				const liElement = html`<list-item id=${elementId} onremove=${onRemove}>${element}</list-item>`;
				event.target.appendChild(liElement);
			}
		});
	};

	return html`
		<main>
			<h1>To Do List!</h1>
			<counter />
			<counter />
			<input onkeypress=${updateList} />
			<ol elements="Test Application" onupdate=${onUpdateList}></ol>
		</main>
	`;
};

mount(app, document.body);
