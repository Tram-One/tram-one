const { TRAM_OBSERVABLE_STORE } = require('../engine-names')
const { getObservableStore } = require('../observable-store')
const { assertGlobalSpaceAndEngine } = require('../asserts')

module.exports = (globalSpace, storeName = TRAM_OBSERVABLE_STORE) => {
	assertGlobalSpaceAndEngine(TRAM_OBSERVABLE_STORE, globalSpace, storeName)

	return (key, value) => {
		// get the store of effects
		const observableStore = getObservableStore(globalSpace, storeName)

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
}
