/**
 * The mutation-observer is a global instance of browsers MutationObserver
 * which tracks when nodes are added or removed.
 *
 * When nodes are added we process their effects. When nodes are removed we process any cleanup,
 * and stop observers that would trigger for that node.
 */

const { observe, unobserve } = require('@nx-js/observer-util')
const { TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS, TRAM_TAG_FOCUS } = require('./node-names')
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

const reapplyFocus = (mutationList) => {
	// check if any nodes had focus
	const hasFocus = node => node[TRAM_TAG_FOCUS]

	const removedNodes = mutationList
		.flatMap(mutation => [...mutation.removedNodes])
		.flatMap(node => [...node.querySelectorAll('*')])

	const elementIndexWithFocus = removedNodes.findIndex(hasFocus)
	const removedElementWithFocus = removedNodes[elementIndexWithFocus]

	// if we couldn't find any, we can leave now
	if (elementIndexWithFocus === -1) { return }

	// check if the number of elements matches (if it does, we can probably focus the same index)
	const addedNodes = mutationList
		.flatMap(mutation => [...mutation.addedNodes])
		.flatMap(node => [...(node.querySelectorAll ? node.querySelectorAll('*') : [])])

	const sameNumberOfElements = addedNodes.length == removedNodes.length

	// if the number of elements changed, we can't confidently re-apply focus
	if (!sameNumberOfElements) { return }

	// if we found the same number of elements, let's re-apply focus to the same child
	addedNodes[elementIndexWithFocus].focus()

	// give it the attribute in case it is edited again
	addedNodes[elementIndexWithFocus][TRAM_TAG_FOCUS] = true

	// also try to set the selection, if there is a selection for this element
	const hasSelectionStart = removedElementWithFocus.selectionStart !== null && removedElementWithFocus.selectionStart !== undefined
	if (hasSelectionStart) {
		addedNodes[elementIndexWithFocus].setSelectionRange(
			removedElementWithFocus.selectionStart,
			removedElementWithFocus.selectionEnd,
			removedElementWithFocus.selectionDirection,
		)
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

	// if any node had focus, get that element and re-add focus to the new node
	reapplyFocus(mutationList)
}))

const getMutationObserver = get

// tell the mutation observer to watch the given node for changes
const startWatcher = (observerName, node) => {
	const observerStore = getMutationObserver(observerName)

	observerStore.observe(node, { childList: true, subtree: true })
}

module.exports = { setupMutationObserver, getMutationObserver, startWatcher }
