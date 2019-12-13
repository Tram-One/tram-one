const { TRAM_OBSERVABLE_STORE, TRAM_HOOK_KEY } = require('../engine-names')
const { getObservableStore } = require('../observable-store')
const { getWorkingKeyValue } = require('../working-key')
const { assertGlobalSpaceAndEngine } = require('../asserts')

module.exports = (globalSpace, storeName = TRAM_OBSERVABLE_STORE, workingKeyName = TRAM_HOOK_KEY) => {
	assertGlobalSpaceAndEngine(TRAM_OBSERVABLE_STORE, globalSpace, storeName)

	function useObservable(value) {
		// get the store of effects
		const observableStore = getObservableStore(globalSpace, storeName)

		// the unique part of the local (vs global) useObservable
		// should probably be abstracted out
		const key = getWorkingKeyValue(globalSpace, workingKeyName)

		// if there is no store, return the value and no-op
		if (!observableStore || !key) return [value, () => {}]

		// saves value into the store if it doesn't exist in the observableStore yet
		if (!Object.prototype.hasOwnProperty.call(observableStore, key)) {
			observableStore[key] = value
		}

		// generate getter for key
		const keyGetter = observableStore[key]

		// generate setter for key
		const isObject = typeof value === 'object'
		const keySetter = newValue => {
			if (isObject) console.warn('Tram-One: Avoid using setters if dealing with objects or arrays')
			observableStore[key] = newValue
		}

		// return getter and setter for the key
		return [keyGetter, keySetter]
	}

	return useObservable
}
