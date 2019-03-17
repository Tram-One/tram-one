const battery = require('hover-battery')
const urlListener = require('url-listener')

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

  return (selector, component, webStorage) => {
    assertIsDefined(selector, 'selector', 'a DOM element or CSS selection string')
    assertIsFunction(component, 'component')
    assertIsObject(webStorage, 'webStorage', true)

    // setup dedicated engine for component state
    setupEngine(globalSpace, 'stateEngine')

    // setup dedicated engine for app state management
    setupEngine(globalSpace, 'appEngine')

    // setup store for effects
    setupLog(globalSpace, 'effectStore')

    // setup working key for hooks
    setupWorkingKey(globalSpace, 'hookKey')

    const appMount = mount(globalSpace)
    // re-mount the app when a state action is triggered
    getEngine(globalSpace, 'stateEngine').addListener(() => {
      appMount(selector, component)
    })

    // re-mount the app when an app action is triggered
    getEngine(globalSpace, 'appEngine').addListener(() => {
      appMount(selector, component)
    })

    // if webStorage is defined, wire it into hover-engine with hover-battery
    // (effectively, set up the initial store values and add appropriate listeners to write to webStorage)
    if (webStorage) {
      getEngine(globalSpace, 'appEngine').addActions(battery(webStorage).actions)
      getEngine(globalSpace, 'appEngine').addListener(battery(webStorage).listener)
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
