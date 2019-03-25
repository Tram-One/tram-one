const { routeElement, switchElement } = require('./routing')
const { registerHtml } = require('../dom')
const mockGetPath = () => window.mockPath
const html = registerHtml()({
  route: routeElement(mockGetPath),
  switch: switchElement(mockGetPath)
})

describe('routing', () => {
  describe('routeElement', () => {
    it('should render a component when path is undefined', () => {
      const mockComponent = () => html`<h1>Mock Component</h1>`
      const result = html`
        <div><route component=${mockComponent} /></div>
      `
      expect(result.outerHTML).toEqual('<div><h1>Mock Component</h1></div>')
    })

    it('should not render a component if the route does not match', () => {
      const mockComponent = () => html`<h1>Mock Component</h1>`
      window.mockPath = 'bar'
      const result = html`
        <div><route path="foo" component=${mockComponent} /></div>
      `
      expect(result.outerHTML).toEqual('<div></div>')
    })

    it('should render a component if the route does match', () => {
      const mockComponent = () => html`<h1>Mock Component</h1>`
      window.mockPath = 'bar'
      const result = html`
        <div><route path="bar" component=${mockComponent} /></div>
      `
      expect(result.outerHTML).toEqual('<div><h1>Mock Component</h1></div>')
    })
  })

  describe('switchElement', () => {
    it('should render the first child', () => {
      const result = html`
        <switch>
          <h1>first</h1>
          <h2>second</h2>
          <h3>third</h3>
        </switch>
      `
      expect(result.outerHTML).toEqual('<h1>first</h1>')
    })

    it('should render the first child that is an element', () => {
      const result = html`
        <switch>
          Text Before elements
          <h1>first</h1>
          <h2>second</h2>
          <h3>third</h3>
          Text after elements
        </switch>
      `
      expect(result.outerHTML).toEqual('<h1>first</h1>')
    })
  })
})
