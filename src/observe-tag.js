const { observe } = require('@nx-js/observer-util')
const { TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } = require('./node-names')

// functions to go to nodes or indicies (made for .map)
const toIndicies = (node, index) => index

// sorting function that prioritizes indicies that are closest to a target
// e.g. target = 3, [1, 2, 3, 4, 5] => [3, 2, 4, 1, 5]
const byDistanceFromIndex = targetIndex => (indexA, indexB) => {
	const diffFromTargetA = Math.abs(indexA - targetIndex)
	const diffFromTargetB = Math.abs(indexB - targetIndex)
	return diffFromTargetA - diffFromTargetB
}

const hasMatchingTagName = tagName => node => {
	// if the tagName matches, we want to process the node, otherwise skip it
	return node.tagName === tagName ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
}

// get an array including the element and all it's children
const parentAndChildrenElements = (node, tagName) => {
	const componentWalker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, hasMatchingTagName(tagName))
	const parentAndChildren = [componentWalker.currentNode]
	while (componentWalker.nextNode()) {
		parentAndChildren.push(componentWalker.currentNode)
	}

	return parentAndChildren
}

/**
 * This is a helper function for the dom creation.
 * This function observes any state values used when making the tag, and allow it to update
 * independently when one of those state values updates.
 *
 * The mutation-observer will unobserve any reactions here when the node is removed.
 */
module.exports = tagFunction => {
	let tagResult
	const buildAndReplaceTag = () => {
		// if there is an existing tagResult, it is the last rendering, and so we want to re-render over it
		let oldTag = tagResult
		let removedElementWithFocusData = {}

		// remove oldTag first so that we unobserve before we re-observe
		if (oldTag) {
			// we need to blow away any old focus data we had
			removedElementWithFocusData = {}

			// determine if this element (or any element under it) had focus
			const oldTagHasFocusedElement = oldTag.contains(document.activeElement)

			// if an element had focus, copy over all the selection data (so we can copy it back later)
			if (oldTagHasFocusedElement) {
				// first, we need to get all the elements that are similar (we'll use tagName)
				// this way, when we rerender, we can search for those tagNames, and just use the index we got here
				const allActiveLikeElements = parentAndChildrenElements(oldTag, document.activeElement.tagName)
				removedElementWithFocusData.index = allActiveLikeElements.findIndex(element => element === document.activeElement)

				// copy over the data
				removedElementWithFocusData.tagName = document.activeElement.tagName
				removedElementWithFocusData.selectionStart = document.activeElement.selectionStart
				removedElementWithFocusData.selectionEnd = document.activeElement.selectionEnd
				removedElementWithFocusData.selectionDirection = document.activeElement.selectionDirection
				removedElementWithFocusData.scrollLeft = document.activeElement.scrollLeft
				removedElementWithFocusData.scrollTop = document.activeElement.scrollTop
			}

			const emptyDiv = document.createElement('div')
			oldTag.replaceWith(emptyDiv)

			// copy the reaction and effects from the old tag to the empty div so we don't lose them
			emptyDiv[TRAM_TAG_REACTION] = oldTag[TRAM_TAG_REACTION]
			emptyDiv[TRAM_TAG_NEW_EFFECTS] = oldTag[TRAM_TAG_NEW_EFFECTS]
			emptyDiv[TRAM_TAG_CLEANUP_EFFECTS] = oldTag[TRAM_TAG_CLEANUP_EFFECTS]

			// set oldTag to emptyDiv, so we can replace it later
			oldTag = emptyDiv
		}

		// build the component
		tagResult = tagFunction()

		// if oldTag was defined, then we need to replace it with the new result
		if (oldTag) {
			// if an element had focus, reapply it
			let elementToGiveFocus
			if (removedElementWithFocusData.index >= 0) {
				const allActiveLikeElements = parentAndChildrenElements(tagResult, removedElementWithFocusData.tagName)

				// we'll look through the elements (in order of nodes closest to original index) and find a tag that matches.
				// this means if it didn't move, we'll get it right away,
				// if it did, we'll look at the elements closest to the original position
				const elementIndexToGiveFocus = allActiveLikeElements
					.map(toIndicies)
					.sort(byDistanceFromIndex(removedElementWithFocusData.index))[0]

				// if the element / child exists, focus it
				elementToGiveFocus = allActiveLikeElements[elementIndexToGiveFocus]
				if (elementToGiveFocus !== undefined) {
					// also try to set the selection, if there is a selection for this element
					const hasSelectionStart = removedElementWithFocusData.selectionStart !== null && removedElementWithFocusData.selectionStart !== undefined
					if (hasSelectionStart) {
						elementToGiveFocus.setSelectionRange(
							removedElementWithFocusData.selectionStart,
							removedElementWithFocusData.selectionEnd,
							removedElementWithFocusData.selectionDirection
						)
					}

					// also set the scrollLeft and scrollTop (since this is reset to 0 by default)
					if (removedElementWithFocusData.scrollLeft || removedElementWithFocusData.scrollTop) {
						elementToGiveFocus.scrollLeft = removedElementWithFocusData.scrollLeft
						elementToGiveFocus.scrollTop = removedElementWithFocusData.scrollTop
					}
				}
			}

			// copy the reaction and effects from the old tag to the new one
			tagResult[TRAM_TAG_REACTION] = oldTag[TRAM_TAG_REACTION]
			tagResult[TRAM_TAG_NEW_EFFECTS] = oldTag[TRAM_TAG_NEW_EFFECTS]
			tagResult[TRAM_TAG_CLEANUP_EFFECTS] = oldTag[TRAM_TAG_CLEANUP_EFFECTS]

			// both these actions cause forced reflow, and can be performance issues
			oldTag.replaceWith(tagResult)
			if (elementToGiveFocus) elementToGiveFocus.focus()
		}
	}

	const tagReaction = observe(buildAndReplaceTag)

	// save the reaction to the node, so that the mutation-observer can unobserve it later
	tagResult[TRAM_TAG_REACTION] = tagReaction

	return tagResult
}
