const urlListener = require('url-listener')
const { registerHtml, registerSvg, useState, useEffect, useGlobalState, useUrlParams, start } = require('./tram-one')
const rootHtml = registerHtml()

describe('Tram-One', () => {
  it('should render app with custom components', () => {
    const customHeader = () => {
      return rootHtml`<h1>Tram-One</h1>`
    }

    const html = registerHtml({ 'custom-header': customHeader })
    const home = () => html`
      <div>
        <custom-header />
        <span>Hello World</span>
      </div>
    `

    const mockPage = document.createElement('div')
    start(mockPage, home)
    expect(mockPage.outerHTML).toEqual('<div><div><h1>Tram-One</h1><span>Hello World</span></div></div>')
  })

  it('should render an app that uses SVG components', () => {
    const svg = registerSvg()
    const customHeader = () => svg`
      <svg>
        <rect width="200" height ="100" stroke="green" stroke-width="4" fill="yellow" />
      </svg>
    `

    const html = registerHtml({ 'custom-header': customHeader })
    const home = () => html`
      <div>
        <custom-header />
        <span>Hello World</span>
      </div>
    `

    const mockPage = document.createElement('div')
    start(mockPage, home)
    expect(mockPage.querySelector('rect').namespaceURI).toEqual('http://www.w3.org/2000/svg')
  })

  it('should trigger side-effects on start', () => {
    const home = () => {
      useEffect(() => {
        document.title = 'Tram-One Rules!'
      })
      return rootHtml`
        <div>Hello World</div>
      `
    }

    const mockPage = document.createElement('div')

    start(mockPage, home)
    expect(document.title).toEqual('Tram-One Rules!')
  })

  it('should render app which immediately updates', () => {
    const counter = () => {
      const [count, setCount] = useState(5)
      if (count < 10) {
        setCount(15)
      }

      return rootHtml`<div>${count}</div>`
    }

    const mockPage = document.createElement('div')
    start(mockPage, counter)
    expect(mockPage.outerHTML).toEqual('<div><div>15</div></div>')
  })

  it('should render app which immediately updates a custom component', () => {
    const counter = () => {
      const [count, setCount] = useState(5)
      if (count < 10) {
        setCount(15)
      }

      return rootHtml`<div>${count}</div>`
    }

    const html = registerHtml({ counter })
    const home = () => html`<div><counter /></div>`

    const mockPage = document.createElement('div')
    start(mockPage, home)
    expect(mockPage.outerHTML).toEqual('<div><div><div>15</div></div></div>')
  })

  it('should render app that uses an effect to update the view', () => {
    const counter = () => {
      const [count, setCount] = useState(5)
      if (count < 10) {
        setCount(15)
      }

      if (count === 15) {
        useEffect(() => {
          setCount(20)
        })
      }

      return rootHtml`<div>${count}</div>`
    }

    const html = registerHtml({ counter })
    const home = () => html`<div><counter /></div>`

    const mockPage = document.createElement('div')
    start(mockPage, home)
    expect(mockPage.outerHTML).toEqual('<div><div><div>20</div></div></div>')
  })

  it('should render app which uses global state', () => {
    const login = () => {
      const [name, setName] = useGlobalState('name', '')
      if (name === '') {
        setName('Jesse')
      }

      return rootHtml`<div>Logged in as ${name}</div>`
    }

    const nameHeader = () => {
      const [name] = useGlobalState('name')
      return rootHtml`<div>Hello ${name}</div>`
    }

    const html = registerHtml({
      'login': login,
      'name-header': nameHeader
    })

    const home = () => html`
      <div>
        <login />
        <name-header />
      </div>
    `
    const mockPage = document.createElement('div')
    start(mockPage, home)
    expect(mockPage.outerHTML).toEqual('<div><div><div>Logged in as Jesse</div><div>Hello Jesse</div></div></div>')
  })

  it('should render app which uses query params', (done) => {
    const home = () => {
      if (useUrlParams('#A')) return rootHtml`<div>On Page A</div>`
      if (useUrlParams('#B')) return rootHtml`<div>On Page B</div>`
      return rootHtml`<div>Page Not Found</div>`
    }

    const mockPage = document.createElement('div')

    urlListener(() => {
      expect(mockPage.outerHTML).toEqual('<div><div>On Page B</div></div>')
      done()
    })

    document.location.hash = 'B'
    start(mockPage, home)
  })
})
