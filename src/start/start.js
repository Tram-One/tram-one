const battery = require('hover-battery')
const urlListener = require('url-listener')

const { TRAM_STATE_ENGINE, TRAM_APP_ENGINE, TRAM_EFFECT_STORE, TRAM_HOOK_KEY } = require('../engineNames')
const { setupEngine, getEngine } = require('../engine')
const { setupLog } = require('../log')
const { mount } = require('../mount')
const { setupWorkingKey } = require('../working-key')
const { assertIsObject, assertIsDefined, assertIsFunction } = require('../asserts')

/**
 * start the app by mounting a component on some DOM or css selector
 * - for complete documentation, please refer to http://tram-one.io/#app-start
 *
 * @param {*} selector
 * @param {object} component
 */
const start = (globalSpace = window) => {
  assertIsObject(globalSpace, 'globalSpace', true)

  // setup dedicated engine for component state
  setupEngine(globalSpace, TRAM_STATE_ENGINE)

  // setup dedicated engine for app state management
  setupEngine(globalSpace, TRAM_APP_ENGINE)

  // setup store for effects
  setupLog(globalSpace, TRAM_EFFECT_STORE)

  // setup working key for hooks
  setupWorkingKey(globalSpace, TRAM_HOOK_KEY)

  return (selector, component, webStorage) => {
    assertIsDefined(selector, 'selector', 'a DOM element or CSS selection string')
    assertIsFunction(component, 'component')
    assertIsObject(webStorage, 'webStorage', true)

    const appMount = mount(globalSpace)
    // re-mount the app when a state action is triggered
    getEngine(globalSpace, TRAM_STATE_ENGINE).addListener(() => {
      appMount(selector, component)
    })

    // re-mount the app when an app action is triggered
    getEngine(globalSpace, TRAM_APP_ENGINE).addListener(() => {
      appMount(selector, component)
    })

    // if webStorage is defined, wire it into hover-engine with hover-battery
    // (effectively, set up the initial store values and add appropriate listeners to write to webStorage)
    if (webStorage) {
      getEngine(globalSpace, TRAM_APP_ENGINE).addActions(battery(webStorage).actions)
      getEngine(globalSpace, TRAM_APP_ENGINE).addListener(battery(webStorage).listener)
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
