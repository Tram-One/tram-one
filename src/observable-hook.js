const ensureObject = require('type/object/ensure')
const ensureString = require('type/string/ensure')

const { TRAM_OBSERVABLE_STORE, TRAM_HOOK_KEY } = require('./engine-names')
const { getObservableStore } = require('./observable-store')
const { getWorkingKeyValue, incrementWorkingKeyBranch } = require('./working-key')

/**
 * Source code for both observable hooks, useStore, and useGlobalStore.
 * This hook exposes a globally stored value (in either case), that can cause the component
 * to update when a subfield of that value is updated.
 *
 * It has a similar interface to React's useState
 */
module.exports = (key, value) => {
	// keys must be strings (if defined)
	ensureString(key, { isOptional: true, errorMessage: `Tram-One: key should be a String (if defined), recieved ${typeof key}, ${key}` })

	// values must be objects (if defined)
	ensureObject(value, { isOptional: true, errorMessage: `Tram-One: value should be an object (if defined), recieved ${typeof value}, ${value}` })

	// get the store of effects
	const observableStore = getObservableStore(TRAM_OBSERVABLE_STORE)

	// increment the working key branch value
	// this makes successive useEffects calls unique (until we reset the key)
	incrementWorkingKeyBranch(TRAM_HOOK_KEY)

	// if a key was passed in, use that, otherwise, generate a key
	const resolvedKey = key || getWorkingKeyValue(TRAM_HOOK_KEY)

	// saves value into the store if it doesn't exist in the observableStore yet
	// and if the value we are writing is defined
	if (!Object.prototype.hasOwnProperty.call(observableStore, resolvedKey) && value !== undefined) {
		observableStore[resolvedKey] = { ...value }
	}

	// get value for key
	const keyValue = observableStore[resolvedKey]

	// return value
	return keyValue
}
