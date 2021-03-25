const { TRAM_TAG_FOCUS } = require('./node-names')

/**
 * This is an internal listener for preservering focus when elements in tram-one would update
 */
module.exports = container => {
	// add event listener that marks a tag as having had focus
	// when there is a clear example, we'll probably want to cleanup and remove the attribute
	container.addEventListener('focusin', event => {
		event.target[TRAM_TAG_FOCUS] = true
	})
}
