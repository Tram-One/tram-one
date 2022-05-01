import { TRAM_TAG, TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } from './node-names';

/* ============= PUBLIC TYPES ========================================
 * A lot of the types here are wrapped using an array / index of 0.
 * This allows us to expose the types as readable on the consumption side.
 * =====================================================================
 */

/**
 * Type for when we can take a CSS Selector, or an HTML Element (mostly mounting).
 */
export type ElementOrSelector = [string | HTMLElement][0];

/**
 * Type for our template renderers (either html or svg).
 * This is not wrapped in an indexed alias, because everything should be provided automatically.
 */
export type DOMTaggedTemplateFunction = (
	strings: TemplateStringsArray,
	...elementsAndAttributes: any[]
) => TramOneElement;

/**
 * Type for custom Tram One Components.
 * They can take in props and children, and return some rendered Element.
 */
export type TramOneComponent = [(props: Props, children: Element) => TramOneElement][0];

/**
 * Type for useStore and useGlobalStore hooks.
 * Describes the kinds of values you can store, either an array or an object.
 *
 * Note, for useGlobalStore, you may have an unknown object if you didn't pass in a defaultValue,
 * that is because we can't determine what type it is, and we will rely on you to clarify.
 */
export type StoreObject = [{ [key: string]: any } | any[]][0];

/**
 * Type to describe the output of Effect.
 * Really this is just an annotation to make TramOneElement easier to understand.
 * In reality, this can be a function (to run on removal), or could be nothing.
 */
export type CleanupEffect = [() => unknown][0];

/**
 * Type for the effect function.
 * This is passed into the useEffect hook
 */
export type Effect = [() => unknown][0];

/**
 * The Props interface for custom Tram One Components.
 * These are all user defined, if any
 */
export type Props = [
	{
		[attribute: string]: any;
	}
][0];

/**
 * Type for registering Tram One Components in the template interface.
 * This is used in registerHtml and registerSvg.
 */
export type Registry = [
	{
		[tag: string]: TramOneComponent;
	}
][0];

/**
 * Type for useUrlParams, which contains a `matches` property,
 * and a set of key - value pairs (for query and path parameters)
 */
export type UrlMatchResults = [
	{
		matches: boolean;
		[parameter: string]: string | boolean;
	}
][0];

/**
 * Type for an element that has Tram-One attributes.
 * See `./node-names.ts` for more details
 */
export interface TramOneElement extends Element {
	[TRAM_TAG]: boolean;
	[TRAM_TAG_REACTION]: Reaction;
	[TRAM_TAG_NEW_EFFECTS]: Effect[];
	[TRAM_TAG_CLEANUP_EFFECTS]: CleanupEffect[];
}

/* ============= INTERNAL TYPES ========================================
 * These won't be exposed or really visible to end users.
 * =====================================================================
 */

/**
 * Type for the container, which always has a first child to render the app on
 */
export interface Container extends Element {
	firstElementChild: Element;
}

/**
 * Type for internally tracking where we our in the render tree.
 */
export type WorkingkeyObject = {
	branch: string[];
	branchIndices: {
		[branch: string]: number;
	};
};

/**
 * Type for nx-js's observer-util.
 * This is really just an annotation to make TramOneElement easier to understand
 */
export type Reaction = () => void;

/**
 * Type for saving properties of an element that we are removing / replacing
 */
export type RemovedElementDataStore = {
	index: number;
	tagName: string;
	scrollLeft: number;
	scrollTop: number;
	selectionStart: number | null;
	selectionEnd: number | null;
	selectionDirection: 'forward' | 'backward' | 'none' | undefined;
};

/**
 * Type for top-level window state that Tram-One uses
 */
export interface TramWindow extends Window {
	'tram-space': {
		[namespace: string]: any;
	};
}

/**
 * Type for Element that could _potentially_ have selection range
 */
export interface ElementPotentiallyWithSelectionAndFocus extends Element {
	setSelectionRange?: (
		selectionStart: number | null | undefined,
		selectionEnd: number | null | undefined,
		selectionDirection?: 'forward' | 'backward' | 'none'
	) => void;
	focus?: () => void;
}

/**
 * Type for internal storage of effects
 */
export interface EffectStore {
	[callLikeKey: string]: Effect;
}