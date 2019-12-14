const { TRAM_OBSERVABLE_STORE, TRAM_HOOK_KEY } = require('../engine-names')
const { getObservableStore } = require('../observable-store')
const { getWorkingKeyValue } = require('../working-key')

module.exports = (key, value) => {
	// get the store of effects
	const observableStore = getObservableStore(TRAM_OBSERVABLE_STORE)

	// if a key was passed in, use that, otherwise, generate a key
	const resolvedKey = key || getWorkingKeyValue(TRAM_HOOK_KEY)

	// if there is no store, return the value and no-op
	if (!observableStore || !resolvedKey) return [value, () => {}]

	// saves value into the store if it doesn't exist in the observableStore yet
	if (!Object.prototype.hasOwnProperty.call(observableStore, resolvedKey)) {
		observableStore[resolvedKey] = value
	}

	// generate getter for key
	const keyGetter = observableStore[resolvedKey]

	// generate setter for key
	const isObject = typeof value === 'object'
	const keySetter = newValue => {
		if (isObject) console.warn('Tram-One: Avoid using setters if dealing with objects or arrays')
		observableStore[resolvedKey] = newValue
	}

	// return getter and setter for the key
	return [keyGetter, keySetter]
}
