const { TRAM_HOOK_KEY, TRAM_EFFECT_QUEUE } = require('../engine-names')
const { getEffectStore } = require('../effect-store')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('../working-key')
const { assertIsFunction } = require('../asserts')

/**
 * @name useEffect
 *
 * @description
 * Hook that triggers component start, update, and cleanup effects.
 * If the result of onEffect is another function, then that function is called on when the component is removed.
 *
 * If the effect is dependent on a observable, it will automatically trigger again if that value updates.
 *
 * If `onEffect` does not return a function, the return is ignored, which means async functions are okay!
 *
 * @param {function} onEffect function to run on component mount
 *
 * @example
 * import { registerHtml, useEffect, useObservable } from 'tram-one'
 * const html = registerHtml()
 *
 * export default () => {
 *   const [title, updateTitle] = useObservable('Tram-One App')
 *   onUpdateTitle = (event) => updateTitle(event.target.value)
 *
 *   useEffect(() => {
 *     document.title = title
 *   })
 *
 *   return html`<input value=${title} onkeydown=${onUpdateTitle} />`
 * }
 */
module.exports = onEffect => {
	assertIsFunction(onEffect, 'effect')

	// get the store of effects
	const effectQueue = getEffectStore(TRAM_EFFECT_QUEUE)

	// get the key value from working-key
	const key = getWorkingKeyValue(TRAM_HOOK_KEY)

	// if there is no store, call start and cleanup
	if (!effectQueue || !key) {
		const cleanup = onEffect()
		if (typeof cleanup === 'function') {
			cleanup()
		}

		return
	}

	// increment the working key branch value
	// this makes successive useEffects calls unique (until we reset the key)
	incrementWorkingKeyBranch(TRAM_HOOK_KEY)

	// append () so that it's easier to debug effects from components
	const callLikeKey = `${key}()`

	// add the effect to the effect queue, so it can be processed later
	effectQueue[callLikeKey] = onEffect
}
