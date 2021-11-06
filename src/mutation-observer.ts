/*
 * The mutation-observer is a global instance of browsers MutationObserver
 * which tracks when nodes are added or removed.
 *
 * When nodes are added we process their effects. When nodes are removed we process any cleanup,
 * and stop observers that would trigger for that node.
 */

const { observe, unobserve } = require('@nx-js/observer-util');

import { TRAM_TAG, TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } from './node-names';
import { buildNamespace } from './namespace';
import { TramOneElement } from './types';

// process new effects for new nodes
const processEffects = (node: Element | TramOneElement) => {
	// if this element doesn't have new effects, it is not be a Tram-One Element
	if (!(TRAM_TAG_NEW_EFFECTS in node)) {
		return;
	}

	const hasEffects = node[TRAM_TAG_NEW_EFFECTS];

	if (hasEffects) {
		// create an array for the cleanup effects
		node[TRAM_TAG_CLEANUP_EFFECTS] = [];

		// run all the effects, saving any cleanup functions to the node
		node[TRAM_TAG_NEW_EFFECTS].forEach((effect) => {
			let cleanup: unknown;

			// this is called when an effect is re-triggered
			const effectReaction = observe(() => {
				// verify that cleanup is a function before calling it (in case it was a promise)
				if (typeof cleanup === 'function') cleanup();
				cleanup = effect();
			});

			// this is called when a component with an effect is removed
			const totalCleanup = () => {
				// verify that cleanup is a function before calling it (in case it was a promise)
				if (typeof cleanup === 'function') cleanup();
				unobserve(effectReaction);
			};

			node[TRAM_TAG_CLEANUP_EFFECTS].push(totalCleanup);
		});

		// set new tag effects to an empty array
		node[TRAM_TAG_NEW_EFFECTS] = [];
	}
};

// call all cleanup effects on the node
const cleanupEffects = (cleanupEffects: (() => void)[]) => {
	cleanupEffects.forEach((cleanup) => cleanup());
};

// unobserve the reaction tied to the node, and run all cleanup effects for the node
const clearNode = (node: Element | TramOneElement) => {
	// if this element doesn't have a Reaction, it is not be a Tram-One Element
	if (!(TRAM_TAG_REACTION in node)) {
		return;
	}

	if (node[TRAM_TAG_CLEANUP_EFFECTS] === undefined) {
		console.log('TRAM_TAG_CLEANUP_EFFECTS', node[TRAM_TAG_CLEANUP_EFFECTS], node);
	}

	unobserve(node[TRAM_TAG_REACTION]);
	cleanupEffects(node[TRAM_TAG_CLEANUP_EFFECTS]);
};

const isTramOneComponent = (node: TramOneElement) => {
	// a node is a component if it has `TRAM_TAG` key on it
	const nodeIsATramOneComponent = node[TRAM_TAG];
	// if it is a tram-one component, we want to process it, otherwise skip it
	return nodeIsATramOneComponent ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
};

// function to get the children (as a list) of the node passed in
// this only needs to query tram-one components, so we can use the attribute `tram`
const childrenComponents = (node: TramOneElement | Element) => {
	const componentWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, isTramOneComponent);
	const children = [];
	while (componentWalker.nextNode()) {
		children.push(componentWalker.currentNode);
	}

	return children;
};

const mutationObserverNamespaceConstructor = () =>
	new MutationObserver((mutationList) => {
		// cleanup orphaned nodes that are no longer on the DOM
		const removedNodesInMutation = (mutation: MutationRecord) => [...mutation.removedNodes];
		const removedNodes = mutationList.flatMap(removedNodesInMutation).flatMap(childrenComponents);

		removedNodes.forEach(clearNode);

		// call new effects on any new nodes
		const addedNodesInMutation = (mutation: MutationRecord) => [...mutation.addedNodes];
		const newNodes = mutationList.flatMap(addedNodesInMutation).flatMap(childrenComponents);

		newNodes.forEach(processEffects);
	});

export const { setup: setupMutationObserver, get: getMutationObserver } = buildNamespace(
	mutationObserverNamespaceConstructor
);

// tell the mutation observer to watch the given node for changes
export const startWatcher = (observerName: string, node: Element) => {
	const observerStore = getMutationObserver(observerName);

	observerStore.observe(node, { childList: true, subtree: true });
};
