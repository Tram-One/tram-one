const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')

const { TRAM_HOOK_KEY } = require('../engine-names')
const { assertIsObject, assertIsString } = require('../asserts')
const { getWorkingKey, pushWorkingKeyBranch, popWorkingKeyBranch } = require('../working-key')

/**
 * function to generate a tagged template function for any namespace
 * - for complete documentation, please refer to http://tram-one.io/#tram-dom
 *
 * @param {string} namespace
 * @param {object} registry
 *
 * @return {function}
 */
const registerDom = (globalSpace = window, workingKeyName = TRAM_HOOK_KEY) => {
  assertIsObject(globalSpace, 'globalSpace', true)
  return (namespace, registry = {}) => {
    assertIsString(namespace, 'namespace', true)
    assertIsObject(registry, 'registry')

    // modify the registry so that each component function updates the hook working key
    const hookedRegistry = globalSpace && Object.keys(registry).reduce((newRegistry, tagName) => {
      const tagFunction = registry[tagName]
      const hookedTagFunction = (...args) => {
        const workingKey = getWorkingKey(globalSpace, workingKeyName)
        if (workingKey) { pushWorkingKeyBranch(globalSpace, workingKeyName)(tagName) }
        const tagResult = tagFunction(...args)
        if (workingKey) { popWorkingKeyBranch(globalSpace, workingKeyName)() }
        return tagResult
      }

      return Object.assign({}, newRegistry, { [tagName]: hookedTagFunction })
    }, {})

    return ninlil(hyperz, belit(namespace), hookedRegistry || registry || {})
  }
}

module.exports = { registerDom }