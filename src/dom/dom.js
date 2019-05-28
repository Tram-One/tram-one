const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')

const { TRAM_HOOK_KEY } = require('../engine-names')
const { assertIsObject, assertIsString } = require('../asserts')
const { getWorkingKey, pushWorkingKeyBranch, popWorkingKeyBranch } = require('../working-key')

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
