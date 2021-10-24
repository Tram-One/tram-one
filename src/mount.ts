import { registerHtml } from './dom-wrappers';
import { TramOneComponent } from './types';

/**
 * Updates a container with an initial component for the first render.
 * @param component the tram-one component to render
 * @param container an element to render the component on
 */
export default (component: TramOneComponent, container: HTMLElement) => {
	const html = registerHtml({
		app: component,
	});

	// this sadly needs to be wrapped in some element so we can process effects
	// otherwise the root node will not have effects applied on it
	const renderedApp = html`<div><app /></div>`;
	container.replaceChild(renderedApp, container.firstElementChild);
};
