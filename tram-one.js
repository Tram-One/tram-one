const xtend = require('xtend')
const assert = require('assert')
const nanorouter = require('nanorouter')
const belCreateElement = require('bel').createElement
const rbelRegister = require('rbel')
const minidux = require('minidux')
const morph = require('nanomorph')
const urlListener = require('url-listener')

class Tram {
  constructor(options) {
    if (options) {
      assert.equal(typeof options, 'object', 'Tram-One: options should be an object')
    }

    options = options || {}
    const defaultRoute = options.defaultRoute || '/404'

    this.router = nanorouter({ default: defaultRoute })
    this.reducers = {}
    this.state = {}
    this.store = {}
  }

  addReducer(key, reducer, state) {
    assert.equal(typeof reducer, 'function', 'Tram-One: reducer should be a function')

    this.reducers[key] = reducer
    this.state[key] = state

    return this
  }

  addRoute(path, page) {
    assert.equal(typeof path, 'string', 'Tram-One: path should be a string')
    assert.equal(typeof page, 'function', 'Tram-One: page should be a function')

    this.router.on(path, (pathParams) => (state) => {
      const completeState = xtend(
        state, {dispatch: this.store.dispatch},
        pathParams
      )
      return page(completeState)
    })

    return this
  }

  dispatch(action) {
    assert.equal(typeof action, 'object', 'Tram-One: action should be an object')

    this.store.dispatch(action)
  }

  start(selector, pathName) {
    const reducers = minidux.combineReducers(this.reducers)
    this.store = minidux.createStore(reducers, this.state)

    this.store.subscribe((state) => {
      this.mount(selector, pathName, state)
    })

    urlListener(() => {
      this.mount(selector, pathName)
    })

    this.mount(selector, pathName, this.store.getState())

    return this
  }

  mount(selector, pathName, state) {
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
    morph(targetChild, this.toNode(routePath, state))

    return this
  }

  toNode(pathName, state) {
    const pageComponent = this.router(pathName)
    const pageState = state || this.state
    return pageComponent(pageState)
  }

  toString(pathName, state) {
    if (typeof window !== 'undefined') {
      return this.toNode(pathName, state).outerHTML
    }
    return this.toNode(pathName, state).toString()
  }

  static html(registry) {
    if (registry) {
      assert.equal(typeof registry, 'object', 'Tram-One: registry should be an object')
      assert.ok(!(registry instanceof Array), 'Tram-One: registry should be an object')
    }

    return rbelRegister(belCreateElement, registry || {})
  }
}

module.exports = Tram
