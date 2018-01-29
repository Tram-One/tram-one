/* eslint-disable max-statements-per-line */
/* eslint-disable import/order */
/* eslint-disable brace-style */

// we won't always have this file built, so don't depend on it to pass lint
// eslint-disable-next-line import/no-unresolved
const TramESM = require('../../dist/tram-one.esm')

const isBrowser = typeof window !== 'undefined'
const TramUMD = isBrowser ? window['tram-one'] : undefined
const testemPath = isBrowser ? window.location.pathname : '/'
const document = isBrowser ? window.document : require('domino').createWindow().document

const tests = (Tram) => describe('Tram', () => {
  const errorPage = () => Tram.html()`<div>Error</div>`
  const successPage = () => Tram.html()`<div>Noraml Page</div>`
  const queryablePage = (value) => Tram.html()`<div id="tram_container">${value}</div>`
  const queryableSelector = '#tram_container'

  const initCounter = 2
  const counterActions = {
    init: () => initCounter,
    add: (counter) => counter + 1
  }
  const counterPage = (store) => Tram.html()`${store.counter}`
  const queryableCounterPage = (store) => Tram.html()`<div id="tram_container">${store.counter}</div>`

  describe('constructor', () => {
    it('should have a default route', () => {
      const app = new Tram()

      app.addRoute('/404', errorPage)
      expect(app.toString('/')).toEqual(errorPage().outerHTML)
    })

    it('should take in a default route', () => {
      const app = new Tram({defaultRoute: '/200'})

      app.addRoute('/200', successPage)
      expect(app.toString('/')).toEqual(successPage().outerHTML)
    })

    it('should not always go to the default', () => {
      const app = new Tram()

      app.addRoute('/404', errorPage)
      app.addRoute('/200', successPage)
      expect(app.toString('/200')).not.toEqual(errorPage().outerHTML)
    })
  })

  describe('addActions', () => {
    it('should update engine with new store', () => {
      const app = new Tram()
      app.addActions({counter: counterActions})
      expect(app.engine.store.counter).toEqual(initCounter)
    })

    it('should be chainable', () => {
      const app = new Tram()
        .addActions({counter: counterActions})
        .addActions({counter2: counterActions})

      expect(app.engine.store.counter).toEqual(initCounter)
      expect(app.engine.store.counter2).toEqual(initCounter)
    })
  })

  describe('addListener', () => {
    it('should call listener when calling an action', () => {
      const app = new Tram()
      const spy = jasmine.createSpy('listener')
      app.addListener(spy)
      app.engine.notifyListeners()
      expect(spy).toHaveBeenCalled()
    })

    it('should be chainable', () => {
      const spy = jasmine.createSpy('listener')
      const spy2 = jasmine.createSpy('listener2')
      const app = new Tram()
        .addListener(spy)
        .addListener(spy2)

      app.engine.notifyListeners()
      expect(spy).toHaveBeenCalled()
      expect(spy2).toHaveBeenCalled()
    })
  })

  describe('addRoute', () => {
    it('should handle new routes in the app', () => {
      const app = new Tram()
      app.addRoute('/', successPage)
      app.addRoute('/good', successPage)
      app.addRoute('/bad', errorPage)
      app.addRoute('/404', errorPage)
      expect(app.toString('/')).toEqual(successPage().outerHTML)
      expect(app.toString('/good')).toEqual(successPage().outerHTML)
      expect(app.toString('/bad')).toEqual(errorPage().outerHTML)
      expect(app.toString('/404')).toEqual(errorPage().outerHTML)
    })

    it('should include the default state in app', () => {
      const app = new Tram()
      app.addRoute('/', counterPage)
      app.addActions({counter: counterActions})
      expect(app.toNode('/')).toEqual(initCounter)
    })

    it('should pass in path params in app', () => {
      const app = new Tram()
      app.addRoute('/:path_param',
        (store, actions, params) => Tram.html()`${params.path_param}`
      )
      expect(app.toNode('/foo')).toEqual('foo')
    })

    it('should be chainable', () => {
      const app = new Tram()
        .addRoute('/good', successPage)
        .addRoute('/bad', errorPage)

      expect(app.toString('/good')).toEqual(successPage().outerHTML)
      expect(app.toString('/bad')).toEqual(errorPage().outerHTML)
    })
  })

  describe('start', () => {
    if (!isBrowser) { return }
    let containerId
    let app
    const originalPushState = window.history.pushState
    let popevent

    beforeEach(() => {
      const childDiv = document.createElement('div')
      containerId = `tram_test_container_${Math.ceil(Math.random() * 1000)}`
      childDiv.id = containerId
      document.body.appendChild(childDiv)
    })

    afterEach(() => {
      const childDiv = document.getElementById(containerId)
      window.history.pushState = originalPushState
      window.removeEventListener('popstate', popevent)
      app.mount = () => {}
      document.body.removeChild(childDiv)
    })

    it('should mount the app to the target', () => {
      app = new Tram()

      app.addActions({counter: counterActions})
      app.addRoute(testemPath, queryableCounterPage)
      app.start(`#${containerId}`)
      const mountedTarget = document.querySelector(queryableSelector)

      expect(mountedTarget.innerHTML).toEqual(initCounter.toString())
    })

    it('should update the app on state change', () => {
      app = new Tram()

      app.addActions({counter: counterActions})
      app.addRoute(testemPath, queryableCounterPage)
      app.start(`#${containerId}`)
      app.engine.actions.add()
      const mountedTarget = document.querySelector(queryableSelector)

      expect(mountedTarget.innerHTML).toEqual('3')
    })

    it('should update on popstate', (done) => {
      app = new Tram()

      app.addRoute(testemPath, queryablePage.bind(this, 5))
      app.addRoute(`${testemPath}#foo`, queryablePage.bind(this, 10))
      app.start(`#${containerId}`)

      const mountedTargetFirst = document.querySelector(queryableSelector)
      window.history.pushState({}, '', `${testemPath}#foo`)
      expect(mountedTargetFirst.innerHTML).toEqual('10')
      popevent = () => {
        const mountedTargetSecond = document.querySelector(queryableSelector)
        expect(mountedTargetSecond.innerHTML).toEqual('5')
        done()
      }
      window.addEventListener('popstate', popevent)
      window.history.back()
    })

    it('should take in a path', () => {
      app = new Tram()

      app.addRoute('/', queryablePage.bind(this, 5))
      app.start(`#${containerId}`, '/')
      const mountedTargetFirst = document.querySelector(queryableSelector)
      expect(mountedTargetFirst.innerHTML).toEqual('5')
    })

    it('should be chainable', () => {
      app = new Tram()
        .addRoute(testemPath, queryablePage.bind(this, 5))
        .start(`#${containerId}`)
      const pageNode = app.toNode(testemPath)

      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.innerHTML).toEqual('5')
      expect(pageNode.innerHTML).toEqual('5')
    })
  })

  describe('mount', () => {
    if (!isBrowser) { return }

    beforeEach(() => {
      const childDiv = document.createElement('div')
      childDiv.id = 'tram_test_container'
      document.body.appendChild(childDiv)
    })

    afterEach(() => {
      const childDiv = document.getElementById('tram_test_container')
      document.body.removeChild(childDiv)
    })

    it('should attach the app to a node', () => {
      const app = new Tram()

      app.addRoute('/', queryablePage)
      const target = document.getElementById('tram_test_container')
      app.mount(target, '/', undefined, document)
      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.outerHTML).toEqual(queryablePage().outerHTML)
    })

    it('should use the default route', () => {
      const app = new Tram()

      app.addRoute('/', queryablePage)
      app.addRoute(testemPath, queryablePage.bind(this, 200))
      const target = document.getElementById('tram_test_container')
      app.mount(target)
      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.outerHTML).toEqual(queryablePage(200).outerHTML)
    })

    it('should attach the app to a selector', () => {
      const app = new Tram()

      app.addRoute('/', queryablePage)
      app.mount('#tram_test_container', '/')
      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.outerHTML).toEqual(queryablePage().outerHTML)
    })

    it('should update the app on re-mount', () => {
      const app = new Tram()

      app.addRoute('/', queryablePage)
      app.addRoute('/200', queryablePage.bind(this, 200))
      app.mount('#tram_test_container', '/')
      app.mount('#tram_test_container', '/200')
      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.outerHTML).toEqual(queryablePage(200).outerHTML)
    })

    it('should be chainable', () => {
      const pageNode = new Tram()
        .addRoute('/', queryablePage.bind(this, 5))
        .mount('#tram_test_container', '/')
        .toNode('/')

      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.innerHTML).toEqual('5')
      expect(pageNode.innerHTML).toEqual('5')
    })
  })

  describe('toNode', () => {
    it('should resolve the path', () => {
      const app = new Tram()
      app.addRoute('/', successPage)
      expect(app.toNode('/').outerHTML).toEqual(successPage().outerHTML)
    })

    it('should have the default state', () => {
      const app = new Tram()
      app.addRoute('/', counterPage)
      app.addActions({counter: counterActions})
      expect(app.toNode('/')).toEqual(initCounter)
    })

    it('should take in a store', () => {
      const app = new Tram()
      app.addRoute('/', counterPage)
      expect(app.toNode('/', {counter: initCounter})).toEqual(initCounter)
    })
  })

  describe('toString', () => {
    it('should return a string', () => {
      const app = new Tram()
      app.addRoute('/404', errorPage)
      expect(app.toString('/')).toEqual(errorPage().outerHTML)
    })
  })

  describe('html', () => {
    it('should generate a dom tree', () => {
      const tramTree = Tram.html()`<div><span></span></div>`
      const docTree = document.createElement('div')
      docTree.appendChild(document.createElement('span'))
      expect(tramTree.outerHTML).toBe(docTree.outerHTML)
    })

    it('should take in a registry', () => {
      const foo = () => Tram.html()`<div><span></span></div>`
      const tramTree = Tram.html({foo})`<foo></foo>`
      const docTree = document.createElement('div')
      docTree.appendChild(document.createElement('span'))
      expect(tramTree.outerHTML).toBe(docTree.outerHTML)
    })
  })
})

if (isBrowser) {
  tests(TramUMD)
} else {
  tests(TramESM)
}
