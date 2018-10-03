/* eslint-disable max-statements-per-line */
/* eslint-disable import/order */
/* eslint-disable brace-style */

module.exports = (Tram, isBrowser, testemPath, document) => describe('Tram', () => {
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

    it('should not always go to the default route', () => {
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
      app.addRoute(
        '/:path_param',
        (store, actions, params) => Tram.html()`${params.path_param}`
      )
      expect(app.toNode('/route_variable')).toEqual('route_variable')
    })

    it('should handle no resolved child routes', () => {
      const app = new Tram()
      const top = (s, a, p, child) => Tram.html()`<div>${child}</div>`
      app.addRoute('/', top, [
        Tram.route()('a', Tram.html()`<span>child</span>`)
      ])
      expect(app.toString('/')).toEqual(Tram.html()`<div></div>`.outerHTML)
    })

    it('should inject child on correct route', () => {
      const app = new Tram()
      const top = (s, a, p, child) => Tram.html()`<div>${child}</div>`
      const child = () => Tram.html()`<span>child</span>`
      app.addRoute('/', top, [
        Tram.route()('a', child)
      ])
      expect(app.toString('/a'))
        .toEqual(Tram.html()`<div><span>child</span></div>`.outerHTML)
    })

    it('should inject child of child route', () => {
      const app = new Tram()
      const top = (s, a, p, child) => Tram.html()`<div>${child}</div>`
      const child = (s, a, p, child) => Tram.html()`<span>${child}</span>`
      const grandchild = () => Tram.html()`<p>grandchild</p>`
      app.addRoute('/', top, [
        Tram.route()('a/', child, [
          Tram.route()('b', grandchild)
        ])
      ])
      expect(app.toString('/a/b'))
        .toEqual(Tram.html()`<div><span><p>grandchild</p></span></div>`.outerHTML)
    })

    it('should handle redundant slashes', () => {
      const app = new Tram()
      const top = (s, a, p, child) => Tram.html()`<div>${child}</div>`
      const child = (s, a, p, child) => Tram.html()`<span>${child}</span>`
      const grandchild = () => Tram.html()`<p>grandchild</p>`
      app.addRoute('/', top, [
        Tram.route()('/a/', child, [
          Tram.route()('/b', grandchild)
        ])
      ])
      expect(app.toString('/a/b'))
        .toEqual(Tram.html()`<div><span><p>grandchild</p></span></div>`.outerHTML)
    })

    it('should inject child on default route (if using just slashes)', () => {
      const app = new Tram()
      const top = (s, a, p, child) => Tram.html()`<div>${child}</div>`
      const child = () => Tram.html()`<span>child</span>`
      app.addRoute('/', top, [
        Tram.route()('/', child)
      ])
      expect(app.toString('/'))
        .toEqual(Tram.html()`<div><span>child</span></div>`.outerHTML)
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
      sessionStorage.clear()
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
      app.addRoute(`${testemPath}#prop_value`, queryablePage.bind(this, 10))
      app.start(`#${containerId}`)

      const mountedTargetFirst = document.querySelector(queryableSelector)
      window.history.pushState({}, '', `${testemPath}#prop_value`)
      expect(mountedTargetFirst.innerHTML).toEqual('10')
      popevent = () => {
        const mountedTargetSecond = document.querySelector(queryableSelector)
        expect(mountedTargetSecond.innerHTML).toEqual('5')
        done()
      }
      window.addEventListener('popstate', popevent)
      window.history.back()
    })

    it('should not write to undefined webStorage', () => {
      app = new Tram()

      app.addActions({counter: counterActions})
      app.addRoute(testemPath, queryableCounterPage)
      app.start(`#${containerId}`)
      app.engine.actions.add()

      expect(sessionStorage.getItem('counter')).toBeNull()
      expect(localStorage.getItem('counter')).toBeNull()
    })

    it('should update defined webStorage', () => {
      const mockStorage = {}
      app = new Tram({webStorage: mockStorage})

      app.addActions({counter: counterActions})
      app.addRoute(testemPath, queryableCounterPage)
      app.start(`#${containerId}`)
      app.engine.actions.add()

      expect(sessionStorage.getItem('counter')).toEqual(null)
      expect(mockStorage.counter).toEqual('3')
    })

    it('should pull from defined webStorage', () => {
      sessionStorage.setItem('counter', 8)
      app = new Tram({webStorage: sessionStorage})

      app.addActions({counter: counterActions})
      app.addRoute(testemPath, queryableCounterPage)
      app.start(`#${containerId}`)

      const mountedTargetFirst = document.querySelector(queryableSelector)
      expect(mountedTargetFirst.innerHTML).toEqual('8')
    })

    it('should update defined webEngine', () => {
      const mockEngine = {}
      app = new Tram({webEngine: mockEngine})

      app.addActions({counter: counterActions})
      app.addRoute(testemPath, queryableCounterPage)
      app.start(`#${containerId}`)

      expect(mockEngine.store).toBeDefined()
      expect(mockEngine.actions).toBeDefined()
      expect(mockEngine.store.counter).toBe(2)
      expect(mockEngine.actions.add).toBeDefined()
    })

    it('should call actions from webEngine', () => {
      const mockEngine = {}
      app = new Tram({webEngine: mockEngine})

      app.addActions({counter: counterActions})
      app.addRoute(testemPath, queryableCounterPage)
      app.start(`#${containerId}`)

      mockEngine.actions.add()
      expect(mockEngine.store.counter).toBe(3)
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

  describe('dom', () => {
    const HTMLNS = 'http://www.w3.org/1999/xhtml'
    const SVGNS = 'http://www.w3.org/2000/svg'

    it('should generate a dom tree', () => {
      const tramTree = Tram.dom()`<div><span></span></div>`
      const docTree = document.createElement('div')
      docTree.appendChild(document.createElement('span'))
      expect(tramTree.outerHTML).toBe(docTree.outerHTML)
    })

    it('should take in a registry', () => {
      const customDIV = () => Tram.dom()`<div><span></span></div>`
      const tramTree = Tram.dom(null, {customDIV})`<customDIV></customDIV>`
      const docTree = document.createElement('div')
      docTree.appendChild(document.createElement('span'))
      expect(tramTree.outerHTML).toBe(docTree.outerHTML)
    })

    it('should default to the html namespace', () => {
      const tramTree = Tram.dom()`<div><span></span></div>`
      expect(tramTree.namespaceURI).toBe(HTMLNS)
      expect(tramTree.getElementsByTagName('span')[0].namespaceURI).toBe(HTMLNS)
    })

    it('should take in a namespace', () => {
      const tramTree = Tram.dom(SVGNS)`<svg><circle /></svg>`

      const docTree = document.createElementNS(SVGNS, 'svg')
      docTree.appendChild(document.createElementNS(SVGNS, 'circle'))

      expect(tramTree.outerHTML).toBe(docTree.outerHTML)
      expect(tramTree.namespaceURI).toBe(SVGNS)
      expect(tramTree.tagName).toBe('svg')
      const tramCircle = tramTree.getElementsByTagName('circle')[0]
      expect(tramCircle.namespaceURI).toBe(SVGNS)
      expect(tramCircle.tagName).toBe('circle')
    })

    it('should not conflict containing namespaces', () => {
      const svgcircle = () => Tram.dom(SVGNS)`<svg><circle /></svg>`
      const htmlTree = Tram.dom(null, {svgcircle})`<div><svgcircle /></div>`
      expect(htmlTree.namespaceURI).toBe(HTMLNS)
      expect(htmlTree.getElementsByTagName('svg')[0].namespaceURI).toBe(SVGNS)
      expect(htmlTree.getElementsByTagName('svg')[0].tagName).toBe('svg')
      expect(htmlTree.getElementsByTagName('circle')[0].namespaceURI).toBe(SVGNS)
      expect(htmlTree.getElementsByTagName('circle')[0].tagName).toBe('circle')
    })
  })

  describe('html', () => {
    it('should use to the html namespace', () => {
      const HTMLNS = 'http://www.w3.org/1999/xhtml'
      const tramTree = Tram.html()`<div><span></span></div>`
      expect(tramTree.namespaceURI).toBe(HTMLNS)
      expect(tramTree.getElementsByTagName('span')[0].namespaceURI).toBe(HTMLNS)
    })
  })

  describe('svg', () => {
    const SVGNS = 'http://www.w3.org/2000/svg'
    it('should use the svg namespace', () => {
      const tramTree = Tram.svg()`<svg><circle /></svg>`
      expect(tramTree.namespaceURI).toBe(SVGNS)
      expect(tramTree.getElementsByTagName('circle')[0].namespaceURI).toBe(SVGNS)
    })
  })

  describe('route', () => {
    it('should make a function that builds objects', () => {
      const route = Tram.route()
      const mockComponent = () => {}
      const mockSubroutes = []
      const routeObject = route('/home', mockComponent, mockSubroutes)
      expect(routeObject.path).toBe('/home')
      expect(routeObject.component).toBe(mockComponent)
      expect(routeObject.subroutes).toBe(mockSubroutes)
    })
  })
})
