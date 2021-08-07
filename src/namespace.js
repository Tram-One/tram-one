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
	// if tram-one is setup, this will be defined
	const tramOneIsSetup = window['tram-space']

	// otherwise, we should warn
	if (!tramOneIsSetup) {
		throw new Error('Tram-One: app has not started yet, but hook was called. Is it being invoked outside a component function?')
	}

	return window['tram-space'][namespace]
}

const set = (namespace, value) => {
	window['tram-space'][namespace] = value
}

module.exports = { setup, get, set, setupTramOneSpace }
