/**
 * namespace is a generic interface for global tram-one state that needs
 * to be persisted in the app container. It exposes a setup and get function.
 */

const setupTramOneSpace = () => {
	window['tram-space'] = {}
}

const setup = constructor => {
	return namespace => {
		window['tram-space'][namespace] = constructor()
		return window['tram-space'][namespace]
	}
}

const get = namespace => {
	return window['tram-space'][namespace]
}

const set = (namespace, value) => {
	window['tram-space'][namespace] = value
}

module.exports = { setup, get, set, setupTramOneSpace }
