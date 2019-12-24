const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')
const ensureIsObject = require('type/object/ensure')
const ensureIsString = require('type/string/ensure')

const { TRAM_HOOK_KEY } = require('./engine-names')
const { pushWorkingKeyBranch, popWorkingKeyBranch, incrementWorkingKeyBranch, copyWorkingKey, restoreWorkingKey } = require('./working-key')
const observeTag = require('./observe-tag')
const processEffects = require('./process-effects')

/**
 * @private
 * @description
 * This function takes in a namespace and registry of custom components,
 * and builds a `dom` template tag function that can take in a template XML string.
 *
 * This function shouldn't need to be called directly, instead, you can use `registerHtml` or `registerSvg`
 *
 * @param {string} namespace namespace to create nodes in (by default XHTML namespace)
 * @param {object} registry mapping of tag names to component functions
 */
const registerDom = (namespace, registry = {}) => {
	ensureIsString(namespace, { isOptional: true, errorMessage: `Tram-One: namespace should be a string, recieved ${typeof namespace}, ${namespace}` })
	ensureIsObject(registry, { errorMessage: `Tram-One: registry should be an object, recieved ${typeof registry}, ${registry}` })

	// modify the registry so that each component function updates the hook working key
	const hookedRegistry = Object.keys(registry).reduce((newRegistry, tagName) => {
		const tagFunction = registry[tagName]
		const hookedTagFunction = (...args) => {
			// push a new branch onto the working key so any values that need to be unique among components
			// but consistent across renders can be read
			const props = JSON.stringify(args[0])
			const newBranch = `${tagName}[${props}]`
			pushWorkingKeyBranch(TRAM_HOOK_KEY, newBranch)

			// increment branch so that we have a unique value (in case we are rendering a list of components)
			incrementWorkingKeyBranch(TRAM_HOOK_KEY)
			const uniqueBranch = copyWorkingKey(TRAM_HOOK_KEY)

			// create a tag function that has the args passed in
			const populatedTagFunction = () => {
				// reset working key so we have the correct place when starting a new component
				restoreWorkingKey(TRAM_HOOK_KEY, uniqueBranch)

				return tagFunction(...args)
			}

			// observe store usage and process any new effects that were called when building the component
			const tagResult = observeTag(() => processEffects(populatedTagFunction))

			// pop the branch off (since we are done rendering this component)
			popWorkingKeyBranch(TRAM_HOOK_KEY)

			return tagResult
		}

		return { ...newRegistry, [tagName]: hookedTagFunction }
	}, {})

	return ninlil(hyperz, belit(namespace), hookedRegistry)
}

module.exports = { registerDom }
