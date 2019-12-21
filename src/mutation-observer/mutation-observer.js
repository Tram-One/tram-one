const { observe, unobserve } = require('@nx-js/observer-util')
const { TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } = require('../node-names')
const { setup, get } = require('../namespace')

/**
 * The mutation-observer is a global instance of browsers MutationObserver
 * which tracks when nodes are added or removed.
 *
 * When nodes are added we process their effects. When nodes are removed we process any cleanup,
 * and stop observers that would trigger for that node.
 */

// process new effects for new nodes
const processEffects = node => {
	const hasNewEffects = node[TRAM_TAG_NEW_EFFECTS]

	if (hasNewEffects) {
		// create an array for the cleanup effects
		node[TRAM_TAG_CLEANUP_EFFECTS] = []

		// run all the effects, saving any cleanup functions to the node
		node[TRAM_TAG_NEW_EFFECTS].forEach(effect => {
			let cleanup

			const effectReaction = observe(() => {
				if (cleanup) cleanup()
				cleanup = effect()
			})

			const totalCleanup = () => {
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

const setupMutationObserver = setup(() => new MutationObserver(mutationList => {
	// cleanup orphaned nodes that are no longer on the DOM
	mutationList
		.flatMap(mutation => [...mutation.removedNodes])
		.flatMap(node => [...node.querySelectorAll('*')])
		.forEach(clearNode)

	// call new effects on any new nodes
	mutationList
		.flatMap(mutation => [...mutation.addedNodes])
		.flatMap(node => [...(node.querySelectorAll ? node.querySelectorAll('*') : [])])
		.forEach(processEffects)
}))

const getMutationObserver = get

// tell the mutation observer to watch the given node for changes
const startWatcher = (observerName, node) => {
	const observerStore = getMutationObserver(observerName)

	observerStore.observe(node, { childList: true, subtree: true })
}

module.exports = { setupMutationObserver, getMutationObserver, startWatcher }
