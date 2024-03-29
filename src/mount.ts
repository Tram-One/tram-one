import { registerHtml } from './dom-wrappers';
import { Container, RootTramOneComponent } from './types';

/**
 * Updates a container with an initial component for the first render.
 * @param component the tram-one component to render
 * @param container an element to render the component on
 */
export default (component: RootTramOneComponent, container: Container) => {
	const html = registerHtml({
		app: component,
	});

	// this sadly needs to be wrapped in some element so we can process effects
	// otherwise the root node will not have effects applied on it
	const renderedApp = html`<tram-one><app /></tram-one>`;
	container.replaceChild(renderedApp, container.firstElementChild);
};
