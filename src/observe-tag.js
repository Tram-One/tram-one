const { observe } = require('@nx-js/observer-util')
const { TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } = require('./node-names')

// functions to go to nodes or indicies (made for .map)
const toIndicies = (node, index) => index
const toNodes = allNodes => index => allNodes[index]

// sorting function that prioritizes indicies that are closest to a target
// e.g. target = 3, [1, 2, 3, 4, 5] => [3, 2, 4, 1, 5]
const byDistanceFromIndex = targetIndex => (indexA, indexB) => {
	const diffFromTargetA = Math.abs(indexA - targetIndex)
	const diffFromTargetB = Math.abs(indexB - targetIndex)
	return diffFromTargetA < diffFromTargetB ? -1 : 1
}

// get an array including the element and all it's children
const parentAndChildrenElements = node => {
	const children = node.querySelectorAll('*')
	return [node, ...children]
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
	const tagReaction = observe(() => {
		// if there is an existing tagResult, it is the last rendering, and so we want to re-render over it
		let oldTag = tagResult
		const removedElementWithFocusData = {
			index: null,
			tagName: null,
			selectionStart: null,
			selectionEnd: null,
			selectionDirection: null,
			scrollLeft: null,
			scrollTop: null
		}

		// remove oldTag first so that we unobserve before we re-observe
		if (oldTag) {
			// if there was focus, we need to figure out what element has it
			const allElements = parentAndChildrenElements(oldTag)
			removedElementWithFocusData.index = allElements.findIndex(element => element === document.activeElement)

			// if an element had focus, copy over all the selection data (so we can copy it back later)
			if (removedElementWithFocusData.index >= 0) {
				// get the actual element
				const removedElementWithFocus = allElements[removedElementWithFocusData.index]

				// copy over the data
				removedElementWithFocusData.tagName = removedElementWithFocus.tagName
				removedElementWithFocusData.selectionStart = removedElementWithFocus.selectionStart
				removedElementWithFocusData.selectionEnd = removedElementWithFocus.selectionEnd
				removedElementWithFocusData.selectionDirection = removedElementWithFocus.selectionDirection
				removedElementWithFocusData.scrollLeft = removedElementWithFocus.scrollLeft
				removedElementWithFocusData.scrollTop = removedElementWithFocus.scrollTop
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
			oldTag.replaceWith(tagResult)

			// if an element had focus, reapply it
			if (removedElementWithFocusData.index >= 0) {
				const allElements = parentAndChildrenElements(tagResult)

				// we'll look through the elements (in order of nodes closest to original index) and find a tag that matches.
				// this means if it didn't move, we'll get it right away,
				// if it did, we'll look at the elements closest to the original position
				const nodeMatchesTagName = node => node.tagName === removedElementWithFocusData.tagName
				const elementToGiveFocus = allElements
					.map(toIndicies)
					.sort(byDistanceFromIndex(removedElementWithFocusData.index))
					.map(toNodes(allElements))
					.find(nodeMatchesTagName)

				// if the element / child exists, focus it
				if (elementToGiveFocus !== undefined) {
					elementToGiveFocus.focus()

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
					elementToGiveFocus.scrollLeft = removedElementWithFocusData.scrollLeft
					elementToGiveFocus.scrollTop = removedElementWithFocusData.scrollTop
				}
			}

			// copy the reaction and effects from the old tag to the new one
			tagResult[TRAM_TAG_REACTION] = oldTag[TRAM_TAG_REACTION]
			tagResult[TRAM_TAG_NEW_EFFECTS] = oldTag[TRAM_TAG_NEW_EFFECTS]
			tagResult[TRAM_TAG_CLEANUP_EFFECTS] = oldTag[TRAM_TAG_CLEANUP_EFFECTS]
		}
	})

	// save the reaction to the node, so that the mutation-observer can unobserve it later
	tagResult[TRAM_TAG_REACTION] = tagReaction

	return tagResult
}
