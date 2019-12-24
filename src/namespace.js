const { getTramSpace } = require('./tram-space')

/**
 * @private
 * @description
 * namespace is a generic interface for objects that need to be persisted in
 * the tramSpace global object. It exposes a setup and get function and runs
 * basic asserts.
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
