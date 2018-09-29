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

    // setup router
    // rlite is the route resolver
    // the internalRouter lets us build a router configuration over multiple calls
    this.router = rlite()
    this.internalRouter = {}

    // setup state-management with HoverEngine
    this.engine = new HoverEngine()
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
    // if webEngine is defined, write the inital values and create a listener to update them
    if (this.webEngine) {
      this.webEngine.store = this.engine.store
      this.webEngine.actions = this.engine.actions

      this.engine.addListener((store, actions) => {
        this.webEngine.store = store
        this.webEngine.actions = actions
      })
    }

    // add a listener that will re-mount the app everytime an action is triggered
    this.engine.addListener((store, actions) => {
      this.mount(selector, pathName, store, actions)
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

    // update our child element with a new version of the app
    // tatermorph knows how to intelligently trigger only diffs that matter
    morph(targetChild, this.toNode(routePath, store, actions), getEvents)

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
    const pageState = store || this.engine.store
    const pageActions = actions || this.engine.actions
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
