const { getTramSpace } = require('../tram-space')

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
	return namespace => {
		const tramSpace = getTramSpace()

		tramSpace[namespace] = constructor()
		return tramSpace[namespace]
	}
}

const get = namespace => {
	const tramSpace = getTramSpace()
	return tramSpace[namespace]
}

const set = (namespace, value) => {
	const tramSpace = getTramSpace()
	tramSpace[namespace] = value
}

module.exports = { setup, get, set }
