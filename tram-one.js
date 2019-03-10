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
   * create an instance of a Tram-One app
   * - for complete documentation, please refer to http://tram-one.io/#constructor
   *
   * @param {{defaultRoute: string, webStorage: object, webEngine: object}} [options]
   * @param {string} options.defaultRoute
   * @param {object} options.webStorage
   * @param {object} options.webEngine
   */
  constructor(options) {
    if (options) {
      assert.equal(typeof options, 'object', 'Tram-One: options should be an object')
    }

    // setup configurations for Tram-One app from options
    options = options || {}
    this.defaultRoute = options.defaultRoute || '/404'
    this.webStorage = options.webStorage
    this.webEngine = options.webEngine
    this.globalSpace = options.globalSpace || window

    // setup dedicated engine for component state
    Tram.setupEngine(this.globalSpace, 'stateEngine')

    // setup dedicated engine for app state management
    Tram.setupEngine(this.globalSpace, 'appEngine')

    // setup store for effects
    Tram.setupLog(this.globalSpace, 'effectStore')

    // setup router
    // rlite is the route resolver
    // the internalRouter lets us build a router configuration over multiple calls
    this.router = rlite()
    this.internalRouter = {}

    // setup state-management with HoverEngine
    // this.engine = new HoverEngine()
  }

  /**
   * add actions and store values
   * - for complete documentation, please refer to http://tram-one.io/#app-add-actions
   *
   * @param {object} actionGroups
   */
  addActions(actionGroups) {
    assert.equal(
      typeof actionGroups, 'object',
      'Tram-One: ActionGroups should be { store-key: { action-name: action-function } }'
    )

    this.engine.addActions(actionGroups)

    // if webEngine exists update it with the latest store and actions
    if (this.webEngine) {
      this.webEngine.store = this.engine.store
      this.webEngine.actions = this.engine.actions
    }

    return this
  }

  /**
   * add callback to call whenever an action is triggered
   * - for complete documentation, please refer tohttp://tram-one.io/#app-add-listener
   *
   * @param {(store, actions, actionName, actionArguement) => {}} listener
   */
  addListener(listener) {
    assert.equal(typeof listener, 'function', 'Tram-One: Listener should be a function')

    this.engine.addListener(listener)

    return this
  }

  /**
   * add route(s) and subroutes
   * - for complete documentation, please refer to http://tram-one.io/#app-add-route
   *
   * @param {string} path
   * @param {function} page
   * @param {Array} [subroutes]
   */
  addRoute(path, page, subroutes) {
    assert.equal(typeof path, 'string', 'Tram-One: path should be a string')
    assert.equal(typeof page, 'function', 'Tram-One: page should be a function')

    // if subroutes are defined, iterate through them and process them as unique routes
    if (subroutes) {
      subroutes.forEach(subroute => {
        assert.equal(typeof subroute, 'object', 'Tram-One: subroute should be an object, use Tram.route to make subroutes')
        // if there is an extra '/' when joining subroutes, just fix them
        const newPath = (path + subroute.path).split('//').join('/')
        // when building a subrouted-page, first build the subroute
        // and then pass that into the parent page (the parent can choose how to render the subroute)
        const newPage = (store, actions, params, resolvedSubroute) => {
          const newSubroute = subroute.component(store, actions, params, resolvedSubroute)
          return page(store, actions, params, newSubroute)
        }
        this.addRoute(newPath, newPage, subroute.subroutes)
      })
    }

    // don't overwrite a route if one already exists
    // this is important because empty subroutes will match their parent
    if (this.internalRouter[path]) {
      console.warn(`Tram-One: path ${path} already exists (this is fine if using empty subroutes)`)
      return this
    }
    // update our internal router, and if this happens to be the last call update the rlite router
    this.internalRouter[path] = (params) => (store, actions) => page(store, actions, params)
    this.router = rlite(this.internalRouter[this.defaultRoute], this.internalRouter)

    return this
  }

  /**
   * start the app by mounting a path on some DOM or css selector
   * - for complete documentation, please refer to http://tram-one.io/#app-start
   *
   * @param {*} selector
   * @param {string} [pathName]
   */
  start(selector, pathName) {
    // if webEngine is defined create a listener to update them
    // it is important that we update this before trying to re-mount the app
    if (this.webEngine) {
      this.engine.addListener((store, actions) => {
        this.webEngine.store = store
        this.webEngine.actions = actions
      })
    }

    // re-mount the app when a state action is triggered
    Tram.getEngine(this.globalSpace, 'stateEngine').addListener(() => {
      this.mount(selector, pathName)
    })

    // re-mount the app when an app action is triggered
    Tram.getEngine(this.globalSpace, 'appEngine').addListener(() => {
      this.mount(selector, pathName)
    })

    // if webStorage is defined, wire it into hover-engine with hover-battery
    // (effectively, set up the initial store values and add appropriate listeners to write to webStorage)
    if (this.webStorage) {
      this.engine.addActions(battery(this.webStorage).actions)
      this.engine.addListener(battery(this.webStorage).listener)
    }

    // wire up urlListener so that we remount whenever the url changes
    urlListener(() => {
      this.mount(selector, pathName)
    })

    // trigger an initial mount
    this.mount(selector, pathName)

    return this
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
  mount(selector, pathName, store, actions) {
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

    // use the pathname provided, or pull the url from the window object
    const routePath = pathName || window.location.href.replace(window.location.origin, '')

    // collect all the DOM events that we should be keeping track of.
    // these events are provided by belit and consumed by tatermorph.
    // (events are strange and actually aren't natively stored on Nodes,
    // but we have to keep track of them so we can know to add or
    // remove them between renders)
    const getEvents = (newNode, oldNode) => {
      return [].concat(newNode.events).concat(oldNode.events)
    }

    // save all the mount effects that have happened, and wipe the effectStore
    const existingEffects = Object.assign({}, Tram.getLog(this.globalSpace, 'effectStore'))
    Tram.clearLog(this.globalSpace, 'effectStore')

    // update our child element with a new version of the app
    // tatermorph knows how to intelligently trigger only diffs that matter
    morph(targetChild, this.toNode(routePath, store, actions), getEvents)

    // get the effects that are new
    const allNewEffects = Object.assign({}, Tram.getLog(this.globalSpace, 'effectStore'))

    // split out effects between existing, new and removed
    const existingEffectKeys = Object.keys(allNewEffects).filter(effect => (effect in existingEffects))
    const newEffectKeys = Object.keys(allNewEffects).filter(effect => !(effect in existingEffects))
    const removedEffectKeys = Object.keys(existingEffects).filter(effect => !(effect in allNewEffects))

    // run all clean up effects if the effect was removed
    removedEffectKeys.forEach(effectKey => existingEffects[effectKey]())

    // add any effects that should be in the store back in
    existingEffectKeys.forEach(effectKey => {
      Tram.getLog(this.globalSpace, 'effectStore')[effectKey] = existingEffects[effectKey]
    })

    // run all new effects that we haven't seen before
    // save any cleanup effects in the effectStore
    newEffectKeys.forEach(effectKey =>
      Tram.getLog(this.globalSpace, 'effectStore')[effectKey] = allNewEffects[effectKey]()
    )

    return this
  }

  /**
   * generate a DOM Node Tree based on a path and a store
   * - for complete documentation, please refer to http://tram-one.io/#app-toNode
   *
   * @param {string} pathName
   * @param {object} [store]
   * @param {object} [actions]
   *
   * @return {HTMLDivElement}
   */
  toNode(pathName, store, actions) {
    assert.equal(typeof pathName, 'string', 'Tram-One: pathName should be a string')

    const pageComponent = this.router(pathName)
    const pageState = store || Tram.getEngine(this.globalSpace, 'appEngine').store
    const pageActions = actions || Tram.getEngine(this.globalSpace, 'appEngine').actions
    return pageComponent(pageState, pageActions)
  }

  /**
   * generate a stringified DOM Tree based on a path and a store
   * - for complete documentation, please refer to http://tram-one.io/#app-toString
   *
   * @param {string} pathName
   * @param {object} [store]
   *
   * @return {string}
   */
  toString(pathName, store) {
    return this.toNode(pathName, store).outerHTML
  }

  static setupEngine(globalSpace = window, engineName) {
    // we do not have a space to put our engine
    if (!globalSpace) return false

    // we already have an engine, return that one
    if (globalSpace[engineName]) return globalSpace[engineName]

    // we do not have a engine, make a new one
    globalSpace[engineName] = new HoverEngine()
    return globalSpace[engineName]
  }

  static setupLog(globalSpace = window, logName) {
    // we do not have a space to put our engine
    if (!globalSpace) return false

    // we already have a log, return that one
    if (globalSpace[logName]) return globalSpace[logName]

    // we do not have a log, make a new one
    globalSpace[logName] = {}
    return globalSpace[logName]
  }

  static getEngine(globalSpace = window, engineName) {
    return globalSpace && globalSpace[engineName]
  }

  static getLog(globalSpace = window, logName) {
    return Tram.getEngine(globalSpace, logName)
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

  static useStore(globalSpace = window, engineName = 'appEngine') {
    const engine = Tram.getEngine(globalSpace, engineName)
    return () => [engine.store, engine.actions]
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

  /**
   * function to create a subroute generator
   * - for complete documentation, please refer to http://tram-one.io/#tram-route
   *
   * @return {(path: string, component: function, subroutes?: Array) => {path, component, subroutes}}
   */
  static route() {
    return (path, component, subroutes) => ({path, component, subroutes})
  }
}

module.exports = Tram
