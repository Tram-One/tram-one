/**
 * Type for when we can take a CSS Selector, or an HTML Element (mostly mounting).
 */
export type ElementOrSelector = keyof HTMLElementTagNameMap | HTMLElement;

/**
 * The Props interface for custom Tram One Components.
 * These are all user defined, if any
 */
export type Props = {
	[attribute: string]: any;
};

/**
 * The Children interface for custom Tram One Components.
 * These can be a combination of strings and DOM Elements
 */
export type Children = (string | Element)[];

/**
 * Type for our template renderers (either html or svg).
 */
export type DOMTaggedTemplateFunction = (strings: TemplateStringsArray, ...elementsAndAttributes: any[]) => Element;

/**
 * Type for custom Tram One Components.
 * They can take in props and children, and return some rendered Element.
 */
export type TramOneComponent = (props?: Props, children?: Children) => Element;

/**
 * Type for registering Tram One Components in the template interface.
 * This is used in registerHtml and registerSvg.
 */
export type Registry = {
	[tag: string]: TramOneComponent;
};

/**
 * Type for useUrlParams, which contains a `matches` property,
 * and a set of key - value pairs (for query and path parameters)
 */
export type UrlMatchResults = {
	matches: boolean;
	[parameter: string]: string | boolean;
};

/**
 * Type for useStore and useGlobalStore hooks.
 * Describes the kinds of values you can store, either an array or an object.
 *
 * Note, for useGlobalStore, you may have an unknown object if you didn't pass in a defaultValue,
 * that is because we can't determine what type it is, and we will rely on you to clarify.
 */
export type StoreObject = { [key: string]: any } | any[];

/**
 * Type for the return of effects.
 * They can either be nothing (void), a function that returns nothing, or a Promise.
 * Anything else should really be avoided if possible
 */
export type EffectReturn = void | (() => void) | Promise<unknown> | unknown;

/**
 * Type for the effect function.
 * This is passed into the useEffect hook
 */
export type Effect = () => EffectReturn;
