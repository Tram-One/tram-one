import { registerDom } from './dom';

/**
 * Updates a container with an initial component for the first render.
 * @param component the tram-one component to render
 * @param container an element to render the component on
 */
export default (component, container) => {
	const html = registerDom({
		app: component,
	});

	const app = html`<tram-one><app /></tram-one>`;

	container.appendChild(app);
};
