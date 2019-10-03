const {assertGlobalSpaceAndEngine, assertIsFunction} = require('../asserts')

/**
 * namespace is a generic interface for objects that need to be persisted in
 * the globalSpace object. It exposes a setup and get function and runs
 * basic asserts.
 *
 * This is used for creating stateEngines (for persisting useState values),
 * workingKeys (for persisting position in render), and logs (for persisting
 * which effects have been triggered).
 */

const setup = constructor => {
	assertIsFunction(constructor, 'constructor')
	return (globalSpace, namespace) => {
		assertGlobalSpaceAndEngine('namespace', globalSpace, namespace)

		// we do not have a space to put our object
		if (!globalSpace) return false

		// if one already exists, return existing one
		if (globalSpace[namespace]) return globalSpace[namespace]

		globalSpace[namespace] = constructor()
		return globalSpace[namespace]
	}
}

const get = (globalSpace, namespace) => {
	assertGlobalSpaceAndEngine('namespace', globalSpace, namespace)
	return globalSpace && globalSpace[namespace]
}

module.exports = {setup, get}
