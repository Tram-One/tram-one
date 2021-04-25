const { TRAM_TAG_FOCUS } = require('./node-names')

/**
 * This is an internal listener for preservering focus when elements in tram-one would update
 */
module.exports = container => {
	// add event listener that marks a tag as having had focus
	container.addEventListener('focusin', event => {
		event.target[TRAM_TAG_FOCUS] = true
	})

	// add event listener that unmarks a tag as having had focus
	container.addEventListener('focusout', event => {
		if (event.relatedTarget) {
			event.target[TRAM_TAG_FOCUS] = false
		}
	})
}
