const { observe } = require('@nx-js/observer-util')
const { TRAM_TAG_REACTION, TRAM_TAG_NEW_EFFECTS, TRAM_TAG_CLEANUP_EFFECTS } = require('../node-names')

// observe the tag creation, so we can know what properties to
// react and trigger an update on
const observeTag = tagFunction => {
	let tagResult
	const tagReaction = observe(() => {
		let oldTag = tagResult

		// remove oldTag first so that we unobserve before we re-observe
		if (oldTag) {
			const emptyDiv = document.createElement('div')
			oldTag.replaceWith(emptyDiv)

			emptyDiv[TRAM_TAG_REACTION] = oldTag[TRAM_TAG_REACTION]
			emptyDiv[TRAM_TAG_NEW_EFFECTS] = oldTag[TRAM_TAG_NEW_EFFECTS]
			emptyDiv[TRAM_TAG_CLEANUP_EFFECTS] = oldTag[TRAM_TAG_CLEANUP_EFFECTS]

			// set oldTag to emptyDiv, so we can replace it later
			oldTag = emptyDiv
		}

		tagResult = tagFunction()

		// if oldTag was defined, then we need to replace it with the new result
		if (oldTag) {
			oldTag.replaceWith(tagResult)

			// copy the reaction and effects from the old tag to the new one
			tagResult[TRAM_TAG_REACTION] = oldTag[TRAM_TAG_REACTION]
			tagResult[TRAM_TAG_NEW_EFFECTS] = oldTag[TRAM_TAG_NEW_EFFECTS]
			tagResult[TRAM_TAG_CLEANUP_EFFECTS] = oldTag[TRAM_TAG_CLEANUP_EFFECTS]
		}
	})

	tagResult[TRAM_TAG_REACTION] = tagReaction

	return tagResult
}

module.exports = observeTag
