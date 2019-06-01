const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')

const { TRAM_HOOK_KEY } = require('../engine-names')
const { assertIsObject, assertIsString } = require('../asserts')
const { getWorkingKey, pushWorkingKeyBranch, popWorkingKeyBranch } = require('../working-key')

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
