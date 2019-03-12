const assert = require('assert')
const belit = require('belit')
const battery = require('hover-battery')
const HoverEngine = require('hover-engine')
const morph = require('tatermorph')
const rlite = require('rlite-router')
const ninlil = require('ninlil')
const hyperz = require('hyperz')
const urlListener = require('url-listener')

/**
 * tram-one
 *
 * a framework for building web-apps - http://tram-one.io/
 */
class Tram {
  /**
   * start the app by mounting a component on some DOM or css selector
   * - for complete documentation, please refer to http://tram-one.io/#app-start
   *
   * @param {*} selector
   * @param {object} component
   */
  static start(globalSpace = window) {

    // setup dedicated engine for component state
    Tram.setupEngine(globalSpace, 'stateEngine')

    // setup dedicated engine for app state management
    Tram.setupEngine(globalSpace, 'appEngine')

    // setup store for effects
    Tram.setupLog(globalSpace, 'effectStore')

    // setup working key to match state and effects to components
    Tram.setupWorkingKey(globalSpace, 'componentKey')

    return (selector, component, webStorage) => {
      const mount = Tram.mount(globalSpace)
      // re-mount the app when a state action is triggered
      Tram.getEngine(globalSpace, 'stateEngine').addListener(() => {
        mount(selector, component)
      })

      // re-mount the app when an app action is triggered
      Tram.getEngine(globalSpace, 'appEngine').addListener(() => {
        mount(selector, component)
      })

      // if webStorage is defined, wire it into hover-engine with hover-battery
      // (effectively, set up the initial store values and add appropriate listeners to write to webStorage)
      if (webStorage) {
        Tram.getEngine(globalSpace, 'appEngine').addActions(battery(webStorage).actions)
        Tram.getEngine(globalSpace, 'appEngine').addListener(battery(webStorage).listener)
      }

      // wire up urlListener so that we remount whenever the url changes
      urlListener(() => {
        mount(selector, component)
      })

      // trigger an initial mount
      mount(selector, component)

      return Tram
    }
  }

  /**
   * internal method for building and updating / creating the app
   * - do not call this to start your app
   * - for complete documentation, please refer to http://tram-one.io/#app-mount
   *
   * @param {*} selector
   * @param {string} [pathName]
   * @param {object} store
   * @param {object} actions
   */
  static mount(globalSpace = window) {
    return (selector, component) => {
      assert.ok(selector !== undefined, 'Tram-One: selector should be a DOM element or CSS selection string')

      // if the selector is a string, try to find the element,
      // otherwise it's probably DOM that we should write directly to
      const target = (typeof selector) === 'string' ? document.querySelector(selector) : selector
      if (target === null) {
        console.warn('Tram-One: could not find target, is the element on the page yet?')
      }

      // build a div to render the app on
      // (if it doesn't exist as a child of the selector, create one first)
      if (!target.firstElementChild) {
        const targetChild = document.createElement('div')
        target.appendChild(targetChild)
      }
      const targetChild = target.firstElementChild

      // collect all the DOM events that we should be keeping track of.
      // these events are provided by belit and consumed by tatermorph.
      // (events are strange and actually aren't natively stored on Nodes,
      // but we have to keep track of them so we can know to add or
      // remove them between renders)
      const getEvents = (newNode, oldNode) => {
        return [].concat(newNode.events).concat(oldNode.events)
      }

      // save all the mount effects that have happened, and wipe the effectStore
      const existingEffects = Object.assign({}, Tram.getLog(globalSpace, 'effectStore'))
      Tram.clearLog(globalSpace, 'effectStore')

      // update our child element with a new version of the app
      // tatermorph knows how to intelligently trigger only diffs that matter on the page
      morph(targetChild, component(), getEvents)

      // get the effects that are new
      const allNewEffects = Object.assign({}, Tram.getLog(globalSpace, 'effectStore'))

      // split out effects between existing, new and removed
      const existingEffectKeys = Object.keys(allNewEffects).filter(effect => (effect in existingEffects))
      const newEffectKeys = Object.keys(allNewEffects).filter(effect => !(effect in existingEffects))
      const removedEffectKeys = Object.keys(existingEffects).filter(effect => !(effect in allNewEffects))

      // run all clean up effects if the effect was removed
      removedEffectKeys.forEach(effectKey => existingEffects[effectKey]())

      // add any effects that should be in the store back in
      existingEffectKeys.forEach(effectKey => {
        Tram.getLog(globalSpace, 'effectStore')[effectKey] = existingEffects[effectKey]
      })

      // run all new effects that we haven't seen before
      // save any cleanup effects in the effectStore
      newEffectKeys.forEach(effectKey =>
        Tram.getLog(globalSpace, 'effectStore')[effectKey] = allNewEffects[effectKey]()
      )

      return Tram
    }
  }

  static setupEngine(globalSpace = window, engineName) {
    // we do not have a space to put our engine
    if (!globalSpace) return false

    globalSpace[engineName] = new HoverEngine()
    return globalSpace[engineName]
  }

  static setupLog(globalSpace = window, logName) {
    // we do not have a space to put our log
    if (!globalSpace) return false

    globalSpace[logName] = {}
    return globalSpace[logName]
  }

  static setupWorkingKey(globalSpace = window, keyName) {
    // we do not have a space to put our working key
    if (!globalSpace) return false

    globalSpace[keyName] = []
    return globalSpace[keyName]
  }

  static getEngine(globalSpace = window, engineName) {
    return globalSpace && globalSpace[engineName]
  }

  static getLog(globalSpace = window, logName) {
    return Tram.getEngine(globalSpace, logName)
  }

  static getWorkingKey(globalSpace = window, keyName) {
    return Tram.getEngine(globalSpace, keyName)
  }

  static clearLog(globalSpace = window, logName) {
    const logStore = Tram.getLog(globalSpace, logName)

    // if there is no log store, return an empty object
    if (!logStore) return {}

    Object.keys(logStore).forEach(key => delete logStore[key])
  }

  static useState(globalSpace = window, engineName = 'stateEngine') {
    return (value, keyPrefix) => {
      // get a state engine
      const stateEngine = Tram.getEngine(globalSpace, engineName)

      // if we couldn't, just return whatever value we got
      if (!stateEngine) return [value, () => {}]

      // generate key using the stack trace
      const key = keyPrefix + (new Error()).stack.match(/(\d+:\d+)/g).slice(0, 5).join('|')

      // save this value in our stateEngine if we haven't
      // check if we have the action (the store value could be falsy)
      if (!stateEngine.actions[`set${key}`]) {
        stateEngine.addActions({
          [key]: {
            init: () => value,
            [`set${key}`]: (oldValue, newValue) => newValue
          }
        })
      }

      // generate getter for key
      const keyGetter =  stateEngine.store[key]

      // generate setter for key
      const keySetter = stateEngine.actions[`set${key}`]

      return [keyGetter, keySetter]
    }
  }

  static useEffect(globalSpace = window, engineName = 'effectStore') {
    return (onEffect, keyPrefix = '') => {
      // get the store of effects
      const effectStore = Tram.getEngine(globalSpace, 'effectStore')

      // if there is no store, call and return
      if (!effectStore) return onEffect()

      // generate key using the stack trace
      const key = keyPrefix + (new Error()).stack.match(/(\d+:\d+)/g).slice(0, 5).join('|')

      effectStore[key] = onEffect
    }
  }

  static useStore(globalSpace = window, engineName = 'appEngine') {
    const engine = Tram.getEngine(globalSpace, engineName)
    return () => [engine.store, engine.actions]
  }

  static addActions(globalSpace = window, engineName = 'appEngine') {
    return (actionGroups) => {
      assert.equal(
        typeof actionGroups, 'object',
        'Tram-One: ActionGroups should be { store-key: { action-name: action-function } }'
      )

      Tram.getEngine(globalSpace, engineName).addActions(actionGroups)

      return Tram
    }
  }

  static addListener(globalSpace = window, engineName = 'appEngine') {
    return (listener) => {
      assert.equal(typeof listener, 'function', 'Tram-One: Listener should be a function')

      Tram.getEngine(globalSpace, engineName).addListener(listener)

      return Tram
    }
  }

  static route(getPath = () => window.location.href.replace(window.location.origin, '')) {
    return (attrs, children) => {
      return rlite(() => '', {
        [attrs.path]: (params) => attrs.component({params, path: attrs.path}, children)
      })(getPath())
    }
  }

  static switch(getPath = () => window.location.href.replace(window.location.origin, '')) {
    return (attrs, children) => {
      return children.filter(child => typeof child === 'object')[0]
    }
  }

  /**
   * function to generate a tagged template function for any namespace
   * - for complete documentation, please refer to http://tram-one.io/#tram-dom
   *
   * @param {string} namespace
   * @param {object} registry
   *
   * @return {function}
   */
  static dom(namespace, registry) {
    if (registry) {
      assert.equal(typeof registry, 'object', 'Tram-One: registry should be an object')
      assert.ok(!(Array.isArray(registry)), 'Tram-One: registry should be an object')
    }

    return ninlil(hyperz, belit(namespace), registry || {})
  }

  /**
   * function to generate a tagged template function for XHTML
   * - for complete documentation, please refer to http://tram-one.io/#tram-html
   *
   * @param {object} registry
   * @return {function}
   */
  static html(registry) {
    return Tram.dom(null, registry)
  }

  /**
   * function to generate a tagged template function for SVG
   * - for complete documentation, please refer to http://tram-one.io/#tram-svg
   *
   * @param {object} registry
   * @return {function}
   */
  static svg(registry) {
    return Tram.dom('http://www.w3.org/2000/svg', registry)
  }
}

module.exports = Tram
