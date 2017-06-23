const Tram = (typeof window !== 'undefined') ? window['tram-one'] : require('../../dist/tram-one')
const testemPath = (typeof window !== 'undefined') ? window.location.pathname : '/'
const document = (typeof window !== 'undefined') ? window.document : require('min-document')

describe('Tram', () => {
  let app
  const errorPage = () => Tram.html()`<div>Error</div>`
  const successPage = () => Tram.html()`<div>Noraml Page</div>`
  const queryablePage = (value) => Tram.html()`<div id="tram_container">${value}</div>`
  const queryableSelector = '#tram_container'

  const counterReducer = (state, action) => {
    if (action.type === 'add') {
      return state + 1
    }
    return state
  }
  const counterPage = (state) => Tram.html()`${state.counter}`
  const queryableCounterPage = (state) => Tram.html()`<div id="tram_container">${state.counter}</div>`
  const counterState = 2

  describe('constructor', () => {
    it('should have a default route', () => {
      app = new Tram()

      app.addRoute('/404', errorPage)
      expect(app.toString('/')).toEqual(errorPage().outerHTML)
    })

    it('should take in a default route', () => {
      app = new Tram({defaultRoute: '/200'})

      app.addRoute('/200', successPage)
      expect(app.toString('/')).toEqual(successPage().outerHTML)
    })

    it('should not always go to the default', () => {
      app = new Tram()

      app.addRoute('/404', errorPage)
      app.addRoute('/200', successPage)
      expect(app.toString('/200')).not.toEqual(errorPage().outerHTML)
    })
  })

  describe('addReducer', () => {
    it('should include reducer in app', () => {
      app = new Tram()
      app.addReducer('counter', counterReducer, {})
      expect(app.reducers['counter']).toEqual(counterReducer)
    })

    it('should include state in app', () => {
      app = new Tram()
      app.addReducer('counter', counterReducer, counterState)
      expect(app.state['counter']).toEqual(counterState)
    })
  })

  describe('addRoute', () => {
    it('should handle new routes in the app', () => {
      app = new Tram()
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
      app = new Tram()
      app.addRoute('/', counterPage)
      app.addReducer('counter', counterReducer, counterState)
      expect(app.toNode('/')).toEqual(counterState)
    })

    it('should pass in path params in app', () => {
      app = new Tram()
      app.addRoute('/:path_param',
        (state) => Tram.html()`${state.path_param}`
      )
      expect(app.toNode('/foo')).toEqual('foo')
    })
  })

  describe('start', () => {
    beforeEach(() => {
      const childDiv = document.createElement('div')
      childDiv.id = 'tram_test_container'
      document.body.appendChild(childDiv)
    })

    afterEach(() => {
      const childDiv = document.getElementById('tram_test_container')
      document.body.removeChild(childDiv)
    })

    it('should mount the app to the target', () => {
      app = new Tram()
      app.addReducer('counter', counterReducer, counterState)
      app.addRoute(testemPath, queryableCounterPage)
      app.start('#tram_test_container')
      const mountedTarget = document.querySelector(queryableSelector)

      expect(mountedTarget.innerHTML).toEqual('2')
    })

    it('should update the app on state change', () => {
      app = new Tram()
      app.addReducer('counter', counterReducer, counterState)
      app.addRoute(testemPath, queryableCounterPage)
      app.start('#tram_test_container')
      app.store.dispatch({type: 'add'})
      const mountedTarget = document.querySelector(queryableSelector)

      expect(mountedTarget.innerHTML).toEqual('3')
    })
  })

  describe('mount', () => {
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
      app = new Tram()

      app.addRoute('/', queryablePage)
      const target = document.getElementById('tram_test_container')
      app.mount(target, '/')
      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.outerHTML).toEqual(queryablePage().outerHTML)
    })

    it('should use the default route', () => {
      app = new Tram()

      app.addRoute('/', queryablePage)
      app.addRoute(testemPath, queryablePage.bind(this, 200))
      const target = document.getElementById('tram_test_container')
      app.mount(target)
      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.outerHTML).toEqual(queryablePage(200).outerHTML)
    })

    it('should attach the app to a selector', () => {
      app = new Tram()

      app.addRoute('/', queryablePage)
      app.mount('#tram_test_container', '/')
      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.outerHTML).toEqual(queryablePage().outerHTML)
    })

    it('should update the app on re-mount', () => {
      app = new Tram()

      app.addRoute('/', queryablePage)
      app.addRoute('/200', queryablePage.bind(this, 200))
      app.mount('#tram_test_container', '/')
      app.mount('#tram_test_container', '/200')
      const mountedTarget = document.querySelector(queryableSelector)
      expect(mountedTarget.outerHTML).toEqual(queryablePage(200).outerHTML)
    })
  })

  describe('toNode', () => {
    it('should resolve the path', () => {
      app = new Tram()
      app.addRoute('/', successPage)
      expect(app.toNode('/').outerHTML).toEqual(successPage().outerHTML)
    })

    it('should have the default state', () => {
      app = new Tram()
      app.addRoute('/', counterPage)
      app.addReducer('counter', counterReducer, counterState)
      expect(app.toNode('/')).toEqual(counterState)
    })

    it('should take in a state', () => {
      app = new Tram()
      app.addRoute('/', counterPage)
      expect(app.toNode('/', {counter: counterState})).toEqual(counterState)
    })
  })

  describe('toString', () => {
    it('should return a string', () => {
      app = new Tram()
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
