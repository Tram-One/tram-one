const assert = require('assert')
const belit = require('belit')
const battery = require('hover-battery')
const HoverEngine = require('hover-engine')
const morph = require('nanomorph')
const rlite = require('rlite-router')
const rbelRegister = require('rbel')
const urlListener = require('url-listener')

class Tram {
  constructor(options) {
    if (options) {
      assert.equal(typeof options, 'object', 'Tram-One: options should be an object')
    }

    options = options || {}
    this.defaultRoute = options.defaultRoute || '/404'

    const webSession = (typeof sessionStorage === 'object') ? sessionStorage : {}
    this.webStorage = (options.webStorage === undefined) ? webSession : options.webStorage

    this.router = rlite()
    this.internalRouter = {}
    this.engine = new HoverEngine()
  }

  addActions(actionGroups) {
    assert.equal(
      typeof actionGroups, 'object',
      'Tram-One: ActionGroups should be { store-key: { action-name: action-function } }'
    )

    this.engine.addActions(actionGroups)

    return this
  }

  addListener(listener) {
    assert.equal(typeof listener, 'function', 'Tram-One: Listener should be a function')

    this.engine.addListener(listener)

    return this
  }

  addRoute(path, page, subroutes) {
    assert.equal(typeof path, 'string', 'Tram-One: path should be a string')
    assert.equal(typeof page, 'function', 'Tram-One: page should be a function')

    if (subroutes) {
      subroutes.forEach(subroute => {
        assert.equal(typeof subroute, 'object', 'Tram-One: subroute should be an object, use Tram.route to make subroutes')
        const newPath = (path + subroute.path).split('//').join('/')
        const newPage = (store, actions, params, resolvedSubroute) => {
          const newSubroute = subroute.component(store, actions, params, resolvedSubroute)
          return page(store, actions, params, newSubroute)
        }
        this.addRoute(newPath, newPage, subroute.subroutes)
      })
    }

    this.internalRouter[path] = (params) => (store, actions) => page(store, actions, params)
    this.router = rlite(this.internalRouter[this.defaultRoute], this.internalRouter)

    return this
  }

  start(selector, pathName) {
    this.engine.addListener((store, actions) => {
      this.mount(selector, pathName, store, actions)
    })

    if (this.webStorage) {
      this.engine.addActions(battery(this.webStorage).actions)
      this.engine.addListener(battery(this.webStorage).listener)
    }

    urlListener(() => {
      this.mount(selector, pathName)
    })

    this.mount(selector, pathName)

    return this
  }

  mount(selector, pathName, store, actions) {
    assert.ok(selector !== undefined, 'Tram-One: selector should be a DOM element or CSS selection string')

    const target = (typeof selector) === 'string' ? document.querySelector(selector) : selector
    if (target === null) {
      console.warn('Tram-One: could not find target, is the element on the page yet?')
    }
    if (!target.firstElementChild) {
      const targetChild = document.createElement('div')
      target.appendChild(targetChild)
    }
    const targetChild = target.firstElementChild

    const routePath = pathName || window.location.href.replace(window.location.origin, '')
    morph(targetChild, this.toNode(routePath, store, actions))

    return this
  }

  toNode(pathName, state, actions) {
    assert.equal(typeof pathName, 'string', 'Tram-One: pathName should be a string')

    const pageComponent = this.router(pathName)
    const pageState = state || this.engine.store
    const pageActions = actions || this.engine.actions
    return pageComponent(pageState, pageActions)
  }

  toString(pathName, state) {
    return this.toNode(pathName, state).outerHTML
  }

  static dom(namespace, registry) {
    if (registry) {
      assert.equal(typeof registry, 'object', 'Tram-One: registry should be an object')
      assert.ok(!(Array.isArray(registry)), 'Tram-One: registry should be an object')
    }

    return rbelRegister(belit(namespace), registry || {})
  }

  static html(registry) {
    return Tram.dom(null, registry)
  }

  static svg(registry) {
    return Tram.dom('http://www.w3.org/2000/svg', registry)
  }

  static route() {
    return (path, component, subroutes) => ({path, component, subroutes})
  }
}

module.exports = Tram
