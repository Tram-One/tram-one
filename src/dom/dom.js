const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')

const { TRAM_HOOK_KEY } = require('../engine-names')
const { assertIsObject, assertIsString } = require('../asserts')
const { pushWorkingKeyBranch, popWorkingKeyBranch, incrementWorkingKeyBranch, copyWorkingKey, restoreWorkingKey } = require('../working-key')
const observeTag = require('./observe-tag')
const processEffects = require('./process-node-effects')

/**
 * This file contains a single function, registerDom, which is responsible
 * for building tagged template functions which translate XML strings to DOM Nodes.
 *
 * This function also enables custom components, such that any component defined
 * in a tag-function mapping object (known as a registry) will resolve to calling
 * that component function.
 *
 * Also this function is responsible for updating the working key (an object
 * which keeps track of hooks called over many renders).
 *
 * @see https://tram-one.io/api/#Tram-One#registerHtml
 */

const registerDom = (globalSpace, workingKeyName = TRAM_HOOK_KEY) => {
	assertIsObject(globalSpace, 'globalSpace', true)

	return (namespace, registry = {}) => {
		assertIsString(namespace, 'namespace', true)
		assertIsObject(registry, 'registry')

		// modify the registry so that each component function updates the hook working key
		const hookedRegistry = globalSpace && Object.keys(registry).reduce((newRegistry, tagName) => {
			const tagFunction = registry[tagName]
			const hookedTagFunction = (...args) => {
				// push a new branch onto the working key
				const props = JSON.stringify(args[0])
				const newBranch = `${tagName}[${props}]`
				pushWorkingKeyBranch(globalSpace, workingKeyName)(newBranch)

				// increment branch so that we have a unique value
				incrementWorkingKeyBranch(globalSpace, workingKeyName)
				const uniqueBranch = copyWorkingKey(globalSpace, workingKeyName)

				// create a tag function that has the args passed in
				// run tag creation with the observer (so that it can be reactive)
				const populatedTagFunction = () => {
					// reset working key so we have the correct place when starting a new component
					restoreWorkingKey(globalSpace, workingKeyName, uniqueBranch)
					return tagFunction(...args)
				}

				const processNewEffects = processEffects(globalSpace)

				const tagResult = observeTag(() => processNewEffects(populatedTagFunction))
				// const tagResult = processNewEffects(() => observeTag(populatedTagFunction))

				// pop the branch off (since we are done rendering this component)
				popWorkingKeyBranch(globalSpace, workingKeyName)()

				return tagResult
			}

			return Object.assign({}, newRegistry, { [tagName]: hookedTagFunction })
		}, {})

		return ninlil(hyperz, belit(namespace), hookedRegistry || registry || {})
	}
}

module.exports = { registerDom }
