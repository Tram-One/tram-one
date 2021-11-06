import { Container, ElementOrSelector } from './types';

/**
 * Helper function for getting an element when given a string or element
 * @param target either a CSS selector, or Element to attach the component to.
 * @returns the container that we can mount on
 */
const getContainerElement = (target: ElementOrSelector): Element => {
	// if the selector is a string, try to find the element,
	// otherwise it's probably DOM that we should write directly to
	if (typeof target === 'string') {
		const selectedElement = document.querySelector(target);
		if (selectedElement === null) {
			throw new Error(`
				Tram-One: could not find target, is the element on the page yet?
				https://github.com/Tram-One/tram-one/issues/179
			`);
		}
		return selectedElement;
	} else {
		return target;
	}
};

/**
 * Function to determine (or create) the element that we will mount our tram-one app onto
 * @param target either a CSS selector, or Element to attach the component to.
 * This elememnt should be initially empty.
 *
 * @returns the container, now with a div that tram-one can manage
 */
export default (target: ElementOrSelector): Container => {
	const container = getContainerElement(target);

	// build a div to render the app on
	// - if it doesn't exist as a child of the selector, create one first
	if (!container.firstElementChild) {
		const containerChild = document.createElement('div');
		container.appendChild(containerChild);
	}

	return container as Container;
};
