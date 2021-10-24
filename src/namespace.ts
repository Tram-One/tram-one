/*
 * namespace is a generic interface for global tram-one state that needs
 * to be persisted in the app container. It exposes a setup and get function.
 */

export const setupTramOneSpace = () => {
	window['tram-space'] = {}
}

export const buildNamespace = <NamespaceStore>(constructor: () => NamespaceStore) => {
	const setup = (namespace: string) : NamespaceStore => {
		window['tram-space'][namespace] = constructor()
		return window['tram-space'][namespace]
	}

	const get = (namespace: string) : NamespaceStore => {
		// if tram-one is setup, this will be defined
		const tramOneIsSetup = window['tram-space']

		// otherwise, we should warn
		// this usually happens when calling a hook outside of a component function
		// but this could be potentially triggered other ways - if we find those, we should broaden the message then
		if (!tramOneIsSetup) {
			throw new Error('Tram-One: app has not started yet, but hook was called. Is it being invoked outside a component function?')
		}

		return window['tram-space'][namespace]
	}

	const set = (namespace: string, value: NamespaceStore) => {
		window['tram-space'][namespace] = value
	}

	return {
		setup,
		get,
		set
	}
}
