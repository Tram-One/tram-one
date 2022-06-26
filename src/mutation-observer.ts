/*
 * The mutation-observer is a global instance of browsers MutationObserver
 * which tracks when nodes are added or removed.
 *
 * When nodes are added we process their effects. When nodes are removed we process any cleanup,
 * and stop observers that would trigger for that node.
 */

const { observe, unobserve } = require('@nx-js/observer-util');

import {
	TRAM_TAG,
	TRAM_TAG_REACTION,
	TRAM_TAG_NEW_EFFECTS,
	TRAM_TAG_CLEANUP_EFFECTS,
	TRAM_TAG_STORE_KEYS,
} from './node-names';
import { buildNamespace } from './namespace';
import { CleanupEffect, TramOneElement } from './types';
import { getObservableStore } from './observable-store';
import { TRAM_OBSERVABLE_STORE, TRAM_KEY_STORE } from './engine-names';
import { decrementKeyStoreValue, getKeyStore, incrementKeyStoreValue } from './key-store';

/**
 * process side-effects for new tram-one nodes
 * (this includes calling effects, and keeping track of stores)
 */
const processTramTags = (node: Node | TramOneElement) => {
	// if this element doesn't have a TRAM_TAG, it's not a Tram-One Element
	if (!(TRAM_TAG in node)) {
		return;
	}

	const hasStoreKeys = node[TRAM_TAG_STORE_KEYS];

	if (hasStoreKeys) {
		// for every store associated with this element, increment the count
		// - this ensures that it doesn't get blown away when we clean up old stores
		node[TRAM_TAG_STORE_KEYS].forEach((key) => {
			incrementKeyStoreValue(TRAM_KEY_STORE, key);
		});
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
				cleanup = effect(node);
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

/**
 * call all cleanup effects on the node
 */
const cleanupEffects = (cleanupEffects: CleanupEffect[]) => {
	cleanupEffects.forEach((cleanup) => cleanup());
};

/**
 * remove the association of the store with this specific element
 */
const removeStoreKeyAssociation = (storeKeys: string[]) => {
	storeKeys.forEach((storeKey) => {
		decrementKeyStoreValue(TRAM_KEY_STORE, storeKey);
	});
};

/**
 * remove any stores that no longer have any elements associated with them
 * see removeStoreKeyAssociation above
 */
const cleanUpObservableStores = () => {
	const observableStore = getObservableStore(TRAM_OBSERVABLE_STORE);
	const keyStore = getKeyStore(TRAM_KEY_STORE);
	Object.entries(keyStore).forEach(([key, observers]) => {
		if (observers === 0) {
			delete observableStore[key];
			delete keyStore[key];
		}
	});
};

/**
 * unobserve the reaction tied to the node, and run all cleanup effects for the node
 */
const clearNode = (node: Node | TramOneElement) => {
	// if this element doesn't have a TRAM_TAG, it's not a Tram-One Element
	if (!(TRAM_TAG in node)) {
		return;
	}

	unobserve(node[TRAM_TAG_REACTION]);
	cleanupEffects(node[TRAM_TAG_CLEANUP_EFFECTS]);
	removeStoreKeyAssociation(node[TRAM_TAG_STORE_KEYS]);
};

const isTramOneComponent = (node: Node | TramOneElement) => {
	// a node is a component if it has `TRAM_TAG` key on it
	const nodeIsATramOneComponent = TRAM_TAG in node;
	// if it is a tram-one component, we want to process it, otherwise skip it
	return nodeIsATramOneComponent ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
};

/**
 * function to get the children (as a list) of the node passed in
 */
const childrenComponents = (node: Node | TramOneElement) => {
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
		const removedNodes = mutationList.flatMap(removedNodesInMutation);
		const removedChildNodes = removedNodes.flatMap(childrenComponents);

		removedChildNodes.forEach(clearNode);

		// call new effects on any new nodes
		const addedNodesInMutation = (mutation: MutationRecord) => [...mutation.addedNodes];
		const newNodes = mutationList.flatMap(addedNodesInMutation);
		const newChildNodes = newNodes.flatMap(childrenComponents);

		newChildNodes.forEach(processTramTags);

		// clean up all local observable stores that have no observers
		cleanUpObservableStores();
	});

export const { setup: setupMutationObserver, get: getMutationObserver } = buildNamespace(
	mutationObserverNamespaceConstructor
);

// tell the mutation observer to watch the given node for changes
export const startWatcher = (observerName: string, node: Element) => {
	const observerStore = getMutationObserver(observerName);

	observerStore.observe(node, { childList: true, subtree: true });
};
