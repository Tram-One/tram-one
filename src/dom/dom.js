const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')

const { TRAM_HOOK_KEY } = require('../engineNames')
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
const registerDom = (globalSpace = window) => {
  assertIsObject(globalSpace, 'globalSpace', true)
  return (namespace, registry = {}) => {
    assertIsString(namespace, 'namespace', true)
    assertIsObject(registry, 'registry')

    // modify the registry so that each component function updates the hook working key
    const hookedRegistry = globalSpace && Object.keys(registry).reduce((newRegistry, tagName) => {
      const tagFunction = registry[tagName]
      const hookedTagFunction = (...args) => {
        const workingKey = getWorkingKey(globalSpace, TRAM_HOOK_KEY)
        workingKey && pushWorkingKeyBranch(globalSpace, TRAM_HOOK_KEY)(tagName)
        const tagResult = tagFunction(...args)
        workingKey && popWorkingKeyBranch(globalSpace, TRAM_HOOK_KEY)()
        return tagResult
      }

      return Object.assign({}, newRegistry, {[tagName]: hookedTagFunction})
    }, {})

    return ninlil(hyperz, belit(namespace), hookedRegistry || registry || {})
  }
}

module.exports = { registerDom }
