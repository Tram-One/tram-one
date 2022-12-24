import { registerDom } from '../dom';
import { listItem } from './list-item';

const html = registerDom({
	'list-item': listItem,
});

export const list = (props) => {
	const updateList = (keyEvent) => {
		if (keyEvent.charCode === 13) {
			// get text content of input
			const newElement = keyEvent.target.value;

			// get the current elements, split and rejoin
			const elementsJSON = JSON.parse(props.elements);
			const newElements = elementsJSON.concat({ id: `li-${parseInt(props.total) + 1}`, name: newElement });
			props.elements = JSON.stringify(newElements);
			props.total = `${parseInt(props.total) + 1}`;

			// clear input
			keyEvent.target.value = '';
		}
	};

	const onUpdateList = (event) => {
		const elements = JSON.parse(props.elements);

		elements.forEach((element) => {
			// if the element doesn't already exist, create it, and append it to the dom
			if (!event.target.querySelector(`#${element.id}`)) {
				const onRemove = () => {
					const listElements = JSON.parse(props.elements);
					const filteredElements = listElements.filter((listElement) => listElement.id !== element.id);
					props.elements = JSON.stringify(filteredElements);
				};
				const liElement = html`<list-item id=${element.id} onremove=${onRemove}>${element.name}</list-item>`;
				event.target.appendChild(liElement);
			}
		});
		// if there are any elements that shouldn't exist anymore, remove them
		const elementIds = elements.map((element) => element.id);
		[...event.target.children].forEach((listElement) => {
			if (!elementIds.includes(listElement.id)) {
				listElement.remove();
			}
		});
	};

	const initialElement = [
		{
			id: 'li-0',
			name: 'Test Application',
		},
	];

	return html`
		<section total="1">
			<input onkeypress=${updateList} />
			<ol elements=${JSON.stringify(initialElement)} onupdate=${onUpdateList}></ol>
		</section>
	`;
};
