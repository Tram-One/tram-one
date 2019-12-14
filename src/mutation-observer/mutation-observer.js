const { observe, unobserve } = require('@nx-js/observer-util')
const { TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } = require('../node-names')
const { setup, get } = require('../namespace')

/**
 * EffectStores in Tram-One are used for basic key-value object mappings that need
 * to be persisted in the globalSpace.
 *
 * Currently this is used with working keys and useEffect to keep track of what
 * effects should be triggered or cleaned up.
 */

// filter mutations that have only removals (these are nodes being removed, not added / updated)
const removalMutations = mutation => mutation.addedNodes.length === 0 && mutation.removedNodes.length > 0

// filter mutations that only have additions (these are new nodes, not updates or removals)
// const additionMuttations = mutation => mutation.addedNodes.length > 0 && mutation.removedNodes.length === 0

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

// unobserve for both observer-util and our mutation observer
const totalUnobserve = node => {
	const hasReaction = node[TRAM_TAG_REACTION]
	const hasEffects = node[TRAM_TAG_CLEANUP_EFFECTS]

	if (hasReaction) {
		console.log('removing node', node)
		unobserve(node[TRAM_TAG_REACTION])
	}

	if (hasEffects) {
		cleanupEffects(node[TRAM_TAG_CLEANUP_EFFECTS])
	}
}

const setupMutationObserver = setup(() => new MutationObserver(mutationList => {
	// unobserve any nodes that were just removed
	mutationList
		.filter(removalMutations)
		.flatMap(mutation => [...mutation.removedNodes])
		.forEach(totalUnobserve)

	// cleanup orphaned nodes that are no longer on the DOM
	// Omae Wa Mou Shindeiru
	mutationList
		.flatMap(mutation => [...mutation.removedNodes])
		.flatMap(node => [...node.querySelectorAll('*')])
		.forEach(totalUnobserve)

	// call new effects on any new nodes
	mutationList
		.flatMap(mutation => [...mutation.addedNodes])
		.flatMap(node => [...(node.querySelectorAll ? node.querySelectorAll('*') : [])])
		.forEach(processEffects)
}))

const getMutationObserver = get

const watchForRemoval = (observerName, node) => {
	const observerStore = getMutationObserver(observerName)

	// if there is no effect store, return an empty object
	if (!observerStore) return

	observerStore.observe(node, { childList: true, subtree: true })
}

module.exports = { setupMutationObserver, getMutationObserver, watchForRemoval }
