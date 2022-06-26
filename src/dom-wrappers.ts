import { registerDom } from './dom';

import { Registry, TramOneHTMLElement, TramOneSVGElement } from './types';

/**
 * @name registerHtml
 * @link https://tram-one.io/#register-html
 * @description
 * Function to generate a tagged template function for XHTML / HTML.
 * Takes in a registry that allows you to import other tag functions and use them in your template string.
 *
 * @param registry map of tag names to functions, use this to use custom elements built in tram-one
 * @return tagged template function that builds HTML components
 */
export const registerHtml = (registry?: Registry) => {
	return registerDom<TramOneHTMLElement>(null, registry);
};

/**
 * @name registerSvg
 * @link https://tram-one.io/#register-svg
 * @description
 * Function to generate a tagged template function for SVG.
 *
 * @param registry map of tag names to functions, use this to use custom elements built in tram-one
 * @return tagged template function that builds SVG components
 */
export const registerSvg = (registry?: Registry) => {
	return registerDom<TramOneSVGElement>('http://www.w3.org/2000/svg', registry);
};
