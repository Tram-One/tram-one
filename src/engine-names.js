/**
 * This file is a collection of strings used to store values
 * in the tram-one global space. If you ever need to debug Tram-One's
 * internal state, you can inspect these on the window.
 *
 * e.g. `window['tram-space']['tram-hook-key']`
 */

module.exports = {
	TRAM_HOOK_KEY: 'tram-hook-key',
	TRAM_EFFECT_STORE: 'tram-effect-store',
	TRAM_EFFECT_QUEUE: 'tram-effect-queue',
	TRAM_OBSERVABLE_STORE: 'tram-observable-store',
	TRAM_MUTATION_OBSERVER: 'tram-mutation-observer'
}
