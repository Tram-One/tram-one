// in reality, this should be either:
// const { ... } = require('tram-one')()
// or
// import Tram from 'tram-one'
// const { ... } = Tram()

const { registerHtml, /* routeElement, switchElement, */ start } = window['tram-one']()

// here we are pulling from the pantograph (which includes raw functions)
// usually you are safe to use the tram-one function like above, however
// since the page is loaded locally, we need to modify how the "getPath" works.
// this is / will be document in a set of pages for the pantograph on the website
const { routeElement, switchElement } = window['tram-one'].pantograph

const html = registerHtml({
  route: routeElement(() => window.location.hash.slice(1)),
  switch: switchElement(() => window.location.hash.slice(1))
})

const color = (attrs) => {
  const routeColor = attrs.params.color
  return html`
    <div style="color: ${routeColor}">${routeColor}</div>
  `
}

const home = () => {
  return html`
    <div>
      Tram-One
      uses <a href="https://github.com/chrisdavies/rlite">rlite</a>
      and <a href="https://github.com/JRJurman/url-listener">url-listener</a>
      to handle routing.
      <br/><br/>
      With rlite-router, Tram-One supports routes,
      path params, query-params, hash routes, and wildcards.
      <br/><br/>
      With url-listener, Tram-One supports can update on pushState, without doing a page reload.
      <br/><br/>

      How these tools are actually delivered are by Switch and Route tags.
      These tags are surfaced from Tram-One as special components.

      <br/><br/>

      <div><a href="#blue">Go to Blue</a></div>
      <div><a href="#red">Go to Red</a></div>
      <div><a href="#green">Go to Green</a></div>

      <br/>

      <route path=":color" component=${color} />
    </div>
  `
}

start('.main', home)
