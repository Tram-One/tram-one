const { TRAM_OBSERVABLE_STORE, TRAM_HOOK_KEY } = require('./engine-names')
const { getObservableStore } = require('./observable-store')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('./working-key')

/**
 * @private
 * @description
 * Source code for both observable hooks, useObservable, and useGlobalObservable.
 * This hook exposes a globally stored value (in either case), that can cause the component
 * to update when that value (or a subfield of that value) is updated.
 *
 * It has a similar interface to React's useState
 */
module.exports = (key, value) => {
	// get the store of effects
	const observableStore = getObservableStore(TRAM_OBSERVABLE_STORE)

	// increment the working key branch value
	// this makes successive useEffects calls unique (until we reset the key)
	incrementWorkingKeyBranch(TRAM_HOOK_KEY)

	// if a key was passed in, use that, otherwise, generate a key
	const resolvedKey = key || getWorkingKeyValue(TRAM_HOOK_KEY)

	// saves value into the store if it doesn't exist in the observableStore yet
	if (!Object.prototype.hasOwnProperty.call(observableStore, resolvedKey)) {
		observableStore[resolvedKey] = value
	}

	// generate getter for key
	const keyGetter = observableStore[resolvedKey]

	// generate setter for key
	// Note: for objects and arrays, it is more performant to update the fields direclty
	const keySetter = newValue => {
		observableStore[resolvedKey] = newValue
	}

	// return getter and setter for the key
	return [keyGetter, keySetter]
}
