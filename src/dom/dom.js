const belit = require('belit')
const ninlil = require('ninlil')
const hyperz = require('hyperz')

const { TRAM_HOOK_KEY, TRAM_RENDER_LOCK } = require('../engine-names')
const { assertIsObject, assertIsString } = require('../asserts')
const { getRenderLock } = require('../render-lock')
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

const registerDom = (globalSpace, workingKeyName = TRAM_HOOK_KEY, renderLockName = TRAM_RENDER_LOCK) => {
  assertIsObject(globalSpace, 'globalSpace', true)

  return (namespace, registry = {}) => {
    assertIsString(namespace, 'namespace', true)
    assertIsObject(registry, 'registry')

    // modify the registry so that each component function updates the hook working key
    const hookedRegistry = globalSpace && Object.keys(registry).reduce((newRegistry, tagName) => {
      const tagFunction = registry[tagName]
      const hookedTagFunction = (...args) => {
        // grab working key (used for isolating hook values)
        const workingKey = getWorkingKey(globalSpace, workingKeyName)

        // push a new branch onto the working key
        if (workingKey) { pushWorkingKeyBranch(globalSpace, workingKeyName)(tagName) }

        // if render lock has already been turned off, we should avoid rendering components
        const { shouldRender } = getRenderLock(globalSpace, renderLockName)
        const tagResult = shouldRender ? tagFunction(...args) : ''

        // pop the branch off (since we are done rendering this component)
        if (workingKey) { popWorkingKeyBranch(globalSpace, workingKeyName)() }

        return tagResult
      }

      return Object.assign({}, newRegistry, { [tagName]: hookedTagFunction })
    }, {})

    return ninlil(hyperz, belit(namespace), hookedRegistry || registry || {})
  }
}

module.exports = { registerDom }
