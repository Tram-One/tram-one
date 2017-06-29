const xtend = require('xtend')
const nanorouter = require('nanorouter')
const belCreateElement = require('bel').createElement
const rbelRegister = require('rbel')
const minidux = require('minidux')
const yoyoUpdate = require('yo-yo').update
const urlListener = require('url-listener')

class Tram {
  constructor(options) {
    options = options || {}
    const defaultRoute = options.defaultRoute || '/404'

    this.router = nanorouter({ default: defaultRoute })
    this.reducers = {}
    this.state = {}
    this.store = {}
  }

  addReducer(key, reducer, state) {
    this.reducers[key] = reducer
    this.state[key] = state

    return this
  }

  addRoute(path, page) {
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
    if (!target.firstElementChild) {
      const targetChild = document.createElement('div')
      target.appendChild(targetChild)
    }
    const targetChild = target.firstElementChild

    const routePath = pathName || window.location.href.replace(window.location.origin, '')
    yoyoUpdate(targetChild, this.toNode(routePath, state))

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
    return rbelRegister(belCreateElement, registry || {})
  }
}

module.exports = Tram
