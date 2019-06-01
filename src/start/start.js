const HoverEngine = require('hover-engine')
const urlListener = require('url-listener')

const { TRAM_STATE_ENGINE, TRAM_GLOBAL_STATE_ENGINE, TRAM_EFFECT_STORE, TRAM_HOOK_KEY } = require('../engine-names')
const { setup, get } = require('../namespace')
const { setupLog } = require('../log')
const { mount } = require('../mount')
const { setupWorkingKey } = require('../working-key')
const { assertIsObject, assertIsDefined, assertIsFunction } = require('../asserts')

const setupEngine = setup(() => new HoverEngine())

/**
 * This file defines a single function, start, which is used to
 * initially mount a component onto an existing element.
 *
 * This function also is responsible for starting all the internal engines
 * required for Tram-One to save internal state and trigger re-renders.
 *
 * While this function defines all the engines and when they should trigger,
 * the actual logic for placing the element on the page is contained in the
 * `mount()` function.
 *
 * @see https://tram-one.io/api/#Tram-One#start
 */

const start = (globalSpace) => {
  assertIsObject(globalSpace, 'globalSpace', true)

  // setup dedicated engine for component state
  setupEngine(globalSpace, TRAM_STATE_ENGINE)

  // setup dedicated engine for app state management
  setupEngine(globalSpace, TRAM_GLOBAL_STATE_ENGINE)

  // setup store for effects
  setupLog(globalSpace, TRAM_EFFECT_STORE)

  // setup working key for hooks
  setupWorkingKey(globalSpace, TRAM_HOOK_KEY)

  return (selector, component) => {
    assertIsDefined(selector, 'selector', 'a DOM element or CSS selection string')
    assertIsFunction(component, 'component')

    const appMount = mount(globalSpace)
    // re-mount the app when a state action is triggered
    const stateEngine = get(globalSpace, TRAM_STATE_ENGINE)
    if (stateEngine) {
      stateEngine.addListener(() => {
        appMount(selector, component)
      })
    }

    // re-mount the app when a global state action is triggered
    const globalStateEngine = get(globalSpace, TRAM_GLOBAL_STATE_ENGINE)
    if (globalStateEngine) {
      globalStateEngine.addListener(() => {
        appMount(selector, component)
      })
    }

    // wire up urlListener so that we remount whenever the url changes
    urlListener(() => {
      appMount(selector, component)
    })

    // trigger an initial mount
    appMount(selector, component)
  }
}

module.exports = { start }
