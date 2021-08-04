/**
 * The mutation-observer is a global instance of browsers MutationObserver
 * which tracks when nodes are added or removed.
 *
 * When nodes are added we process their effects. When nodes are removed we process any cleanup,
 * and stop observers that would trigger for that node.
 */

const { observe, unobserve } = require('@nx-js/observer-util')
const { TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } = require('./node-names')
const { setup, get } = require('./namespace')

// process new effects for new nodes
const processEffects = node => {
	const hasNewEffects = node[TRAM_TAG_NEW_EFFECTS]

	if (hasNewEffects) {
		// create an array for the cleanup effects
		node[TRAM_TAG_CLEANUP_EFFECTS] = []

		// run all the effects, saving any cleanup functions to the node
		node[TRAM_TAG_NEW_EFFECTS].forEach(effect => {
			let cleanup

			// this is called when an effect is re-triggered
			const effectReaction = observe(() => {
				// verify that cleanup is a function before calling it (in case it was a promise)
				if (typeof cleanup === 'function') cleanup()
				cleanup = effect()
			})

			// this is called when a component with an effect is removed
			const totalCleanup = () => {
				// verify that cleanup is a function before calling it (in case it was a promise)
				if (typeof cleanup === 'function') cleanup()
				unobserve(effectReaction)
			}

			node[TRAM_TAG_CLEANUP_EFFECTS].push(totalCleanup)
		})

		// set new tag effects to an empty array
		node[TRAM_TAG_NEW_EFFECTS] = []
	}
}

// call all cleanup effects on the node
const cleanupEffects = cleanupEffects => {
	cleanupEffects.forEach(cleanup => cleanup())
}

// unobserve the reaction tied to the node, and run all cleanup effects for the node
const clearNode = node => {
	const hasReaction = node[TRAM_TAG_REACTION]
	const hasEffects = node[TRAM_TAG_CLEANUP_EFFECTS]

	if (hasReaction) {
		unobserve(node[TRAM_TAG_REACTION])
	}

	if (hasEffects) {
		cleanupEffects(node[TRAM_TAG_CLEANUP_EFFECTS])
	}
}

const isTramOneComponent = node => {
	if (node.getAttribute('tram') !== null) {
		return NodeFilter.FILTER_ACCEPT
	}
	return NodeFilter.FILTER_SKIP
}

// function to get the children (as a list) of the node passed in
// this only needs to query tram-one components, so we can use the attribute `tram`
const childrenComponents = node => {
	const componentWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, isTramOneComponent)
	const children = []
	while (componentWalker.nextNode()) {
		children.push(componentWalker.currentNode)
	}
	return children
}

const setupMutationObserver = setup(() => new MutationObserver(mutationList => {
	// cleanup orphaned nodes that are no longer on the DOM
	const removedNodes = mutationList
		.flatMap(mutation => [...mutation.removedNodes])
		.flatMap(childrenComponents)

	removedNodes.forEach(clearNode)

	// call new effects on any new nodes
	const newNodes = mutationList
		.flatMap(mutation => [...mutation.addedNodes])
		.flatMap(childrenComponents)

	newNodes.forEach(processEffects)
}))

const getMutationObserver = get

// tell the mutation observer to watch the given node for changes
const startWatcher = (observerName, node) => {
	const observerStore = getMutationObserver(observerName)

	observerStore.observe(node, { childList: true, subtree: true })
}

module.exports = { setupMutationObserver, getMutationObserver, startWatcher }
