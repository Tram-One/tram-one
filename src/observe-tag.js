const { observe } = require('@nx-js/observer-util')
const { TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } = require('./node-names')

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
			selectionStart: null,
			selectionEnd: null,
			selectionDirection: null
		}

		// remove oldTag first so that we unobserve before we re-observe
		if (oldTag) {
			// if there was focus, we need to figure out what element has it
			const children = oldTag.querySelectorAll('*')
			const parentAndChildrenNodes = [oldTag, ...children]
			removedElementWithFocusData.index = parentAndChildrenNodes.findIndex(element => element === document.activeElement)

			// if an element had focus, copy over all the selection data (so we can copy it back later)
			if (removedElementWithFocusData.index >= 0) {
				const removedElementWithFocus = parentAndChildrenNodes[removedElementWithFocusData.index]
				removedElementWithFocusData.selectionStart = removedElementWithFocus.selectionStart
				removedElementWithFocusData.selectionEnd = removedElementWithFocus.selectionEnd
				removedElementWithFocusData.selectionDirection = removedElementWithFocus.selectionDirection
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
				const children = tagResult.querySelectorAll('*')

				const elementToGiveFocus = [tagResult, ...children][removedElementWithFocusData.index]
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
