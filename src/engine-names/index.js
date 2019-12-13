/**
 * This file is a collection of strings used to store values
 * in the global space. If you ever need to debug Tram-One's
 * internal state, you can inspect these on the window.
 *
 * e.g. `window['tram-hook-key']`
 */

module.exports = {
	TRAM_HOOK_KEY: 'tram-hook-key',
	TRAM_STATE_ENGINE: 'tram-state-engine',
	TRAM_GLOBAL_STATE_ENGINE: 'tram-global-state-engine',
	TRAM_EFFECT_STORE: 'tram-effect-store',
	TRAM_EFFECT_QUEUE: 'tram-effect-queue',
	TRAM_RENDER_LOCK: 'tram-render-lock',
	TRAM_OBSERVABLE_STORE: 'tram-observable-store',
	TRAM_MUTATION_OBSERVER: 'tram-mutation-observer',
	TRAM_NEW_EFFECT_QUEUE: 'tram-new-effect-queue'
}
