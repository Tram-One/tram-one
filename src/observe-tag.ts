const { observe } = require('@nx-js/observer-util');

import {
	TRAM_TAG_REACTION,
	TRAM_TAG_NEW_EFFECTS,
	TRAM_TAG_CLEANUP_EFFECTS,
	TRAM_TAG,
	TRAM_TAG_NAME,
	TRAM_TAG_PROPS,
	TRAM_TAG_GLOBAL_STORE_KEYS,
} from './node-names';
import { TramOneElement, RemovedElementDataStore, Reaction, ElementPotentiallyWithSelectionAndFocus } from './types';

// functions to go to nodes or indices (made for .map)
const toIndices = (node: Node, index: number) => index;

// sorting function that prioritizes indices that are closest to a target
// e.g. target = 3, [1, 2, 3, 4, 5] => [3, 2, 4, 1, 5]
const byDistanceFromIndex = (targetIndex: number) => (indexA: number, indexB: number) => {
	const diffFromTargetA = Math.abs(indexA - targetIndex);
	const diffFromTargetB = Math.abs(indexB - targetIndex);
	return diffFromTargetA - diffFromTargetB;
};

const hasMatchingTagName = (tagName: string) => (node: Node | Element) => {
	const nodeHasMatchingTagName = 'tagName' in node && node.tagName === tagName;
	// if the tagName matches, we want to process the node, otherwise skip it
	return nodeHasMatchingTagName ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
};

// get an array including the element and all it's children
const parentAndChildrenElements = (node: Element, tagName: string) => {
	const matchesTagName = hasMatchingTagName(tagName);
	const componentWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, matchesTagName);
	const parentAndChildren = [componentWalker.currentNode];
	while (componentWalker.nextNode()) {
		parentAndChildren.push(componentWalker.currentNode);
	}

	// since we are looking for elements (things with tagNames)
	// we can safely declare this as an array of Elements
	return parentAndChildren as Element[];
};

const defaultRemovedElementWithFocusData: RemovedElementDataStore = {
	index: -1,
	tagName: '',
	scrollLeft: 0,
	scrollTop: 0,
	selectionStart: null,
	selectionEnd: null,
	selectionDirection: undefined,
};

/**
 * This is a helper function for the dom creation.
 * This function observes any state values used when making the tag, and allow it to update
 * independently when one of those state values updates.
 *
 * The mutation-observer will unobserve any reactions here when the node is removed.
 *
 * The parameter tagFunction is almost a TramOneComponent, but it already has the props and children prepopulated,
 * and so has no parameters, but returns a TramOneElement
 */
export default (tagFunction: () => TramOneElement): TramOneElement => {
	let tagResult: TramOneElement | undefined;
	const buildAndReplaceTag = () => {
		// if there is an existing tagResult, it is the last rendering, and so we want to re-render over it
		let oldTag = tagResult;
		let removedElementWithFocusData = defaultRemovedElementWithFocusData;

		// remove oldTag first so that we unobserve before we re-observe
		if (oldTag) {
			// we need to blow away any old focus data we had
			removedElementWithFocusData = defaultRemovedElementWithFocusData;

			// determine if this element (or any element under it) had focus
			const oldTagHasFocusedElement = oldTag.contains(document.activeElement);

			// if an element had focus, copy over all the selection data (so we can copy it back later)
			if (oldTagHasFocusedElement) {
				// we'll assume that the element is an HTMLInputElement, in reality other kinds of elements will be caught here,
				// but that's fine, since they have null as selection attributes, and setting them to null is fine
				const activeElement = document.activeElement as HTMLInputElement;

				// first, we need to get all the elements that are similar (we'll use tagName)
				// this way, when we rerender, we can search for those tagNames, and just use the index we got here
				const allActiveLikeElements = parentAndChildrenElements(oldTag, activeElement.tagName);
				removedElementWithFocusData.index = allActiveLikeElements.findIndex((element) => element === activeElement);

				// copy over the data
				removedElementWithFocusData.tagName = activeElement.tagName;
				removedElementWithFocusData.scrollLeft = activeElement.scrollLeft;
				removedElementWithFocusData.scrollTop = activeElement.scrollTop;
				removedElementWithFocusData.selectionStart = activeElement.selectionStart;
				removedElementWithFocusData.selectionEnd = activeElement.selectionEnd;
				removedElementWithFocusData.selectionDirection = activeElement.selectionDirection || undefined;
			}

			const emptyDiv = document.createElement('div') as unknown as TramOneElement;
			oldTag.replaceWith(emptyDiv);

			// copy the reaction and effects from the old tag to the empty div so we don't lose them
			emptyDiv[TRAM_TAG_REACTION] = oldTag[TRAM_TAG_REACTION];
			emptyDiv[TRAM_TAG_NEW_EFFECTS] = oldTag[TRAM_TAG_NEW_EFFECTS];
			emptyDiv[TRAM_TAG_CLEANUP_EFFECTS] = oldTag[TRAM_TAG_CLEANUP_EFFECTS];

			// copy over development props
			if (process.env.NODE_ENV === 'development') {
				emptyDiv[TRAM_TAG_NAME] = oldTag[TRAM_TAG_NAME];
				emptyDiv[TRAM_TAG_PROPS] = oldTag[TRAM_TAG_PROPS];
				emptyDiv[TRAM_TAG_GLOBAL_STORE_KEYS] = oldTag[TRAM_TAG_GLOBAL_STORE_KEYS];
			}

			// set oldTag to emptyDiv, so we can replace it later
			oldTag = emptyDiv;
		}

		// build the component
		tagResult = tagFunction();

		// if oldTag was defined, then we need to replace it with the new result
		if (oldTag) {
			// if an element had focus, reapply it
			let elementToGiveFocus;
			if (removedElementWithFocusData.index >= 0) {
				const allActiveLikeElements = parentAndChildrenElements(tagResult, removedElementWithFocusData.tagName);

				// we'll look through the elements (in order of nodes closest to original index) and find a tag that matches.
				// this means if it didn't move, we'll get it right away,
				// if it did, we'll look at the elements closest to the original position
				const elementIndexToGiveFocus = allActiveLikeElements
					.map(toIndices)
					.sort(byDistanceFromIndex(removedElementWithFocusData.index))[0];

				elementToGiveFocus = allActiveLikeElements[elementIndexToGiveFocus] as ElementPotentiallyWithSelectionAndFocus;
				// also try to set the selection, if there is a selection for this element
				try {
					if (elementToGiveFocus.setSelectionRange !== undefined) {
						elementToGiveFocus.setSelectionRange(
							removedElementWithFocusData.selectionStart,
							removedElementWithFocusData.selectionEnd,
							removedElementWithFocusData.selectionDirection
						);
					}
				} catch (exception) {
					// don't worry if we fail
					// this can happen if the element has a `setSelectionRange` but it isn't supported
					// e.g. input with type="range"
				}

				elementToGiveFocus.scrollLeft = removedElementWithFocusData.scrollLeft;
				elementToGiveFocus.scrollTop = removedElementWithFocusData.scrollTop;
			}

			// don't lose track that this is still a tram-one element
			tagResult[TRAM_TAG] = true;

			// copy the reaction and effects from the old tag to the new one
			tagResult[TRAM_TAG_REACTION] = oldTag[TRAM_TAG_REACTION];
			tagResult[TRAM_TAG_NEW_EFFECTS] = oldTag[TRAM_TAG_NEW_EFFECTS];
			tagResult[TRAM_TAG_CLEANUP_EFFECTS] = oldTag[TRAM_TAG_CLEANUP_EFFECTS];

			// copy over development props
			if (process.env.NODE_ENV === 'development') {
				tagResult[TRAM_TAG_NAME] = oldTag[TRAM_TAG_NAME];
				tagResult[TRAM_TAG_PROPS] = oldTag[TRAM_TAG_PROPS];
				tagResult[TRAM_TAG_GLOBAL_STORE_KEYS] = oldTag[TRAM_TAG_GLOBAL_STORE_KEYS];
			}

			// both these actions cause forced reflow, and can be performance issues
			oldTag.replaceWith(tagResult);
			if (elementToGiveFocus && elementToGiveFocus.focus) elementToGiveFocus.focus();
		}
	};

	const tagReaction = observe(buildAndReplaceTag) as Reaction;

	// tagResult is always assigned as an artifact of the observe() call above
	// if it isn't, we want to know about it
	if (tagResult === undefined) {
		throw new Error(`
			Tram-One: tagResult was not defined after building the tag.
			https://github.com/Tram-One/tram-one/issues/177
		`);
	}

	// save the reaction to the node, so that the mutation-observer can unobserve it later
	tagResult[TRAM_TAG_REACTION] = tagReaction;

	return tagResult;
};
