const Tram = require('../../tram-one')
const app = new Tram()

const fakeLink = (attrs, children) => {
  const linkStyle = `
    text-decoration: underline;
    cursor: pointer;
    user-select: none;
  `
  const nav = () => window.history.pushState({}, '', attrs.href)
  return Tram.html()`
    <span style=${linkStyle} onclick=${nav}>${children}</span>
  `
}

const html = Tram.html({
  'fake-link': fakeLink
})

const home = () => {
  return html`
    <div>
      <h1>This is the routes example!</h1>

      Tram-One uses
      <a href="https://github.com/chrisdavies/rlite">rlite</a> and
      <a href="https://github.com/JRJurman/url-listener">url-listener</a>
      to handle routing.
      <br />
      With rlite-router, Tram-One supports routes,
      path params, query-params, hash routes, and wildcards.
      <br />
      With url-listener, Tram-One supports can update on pushState, without doing a page reload.
      <br />

      Note: in order to use some dynamic routes, you'll need a server, or hosting to
      handle client side routing (like <a href="https://surge.sh/">surge.sh</a>)

      <br />
      <a href="/page1">Go to Page 1</a>
      or <fake-link href="/page1">Soft Load Page 1</fake-link>
    </div>
  `
}

const page1 = () => {
  return html`
    <div>
      <h2>This is the First Page!</h2>

      <a href="/">Go to the Home Page</a>
      <br>
      <a href="/page#2">Go to page 2</a>
      or
      <fake-link href="/page#2">Soft Load Page 2</fake-link>
    </div>
  `
}

const page2 = () => {
  return html`
    <div>
      <h2>This is the Second Page!</h2>

      <a href="/">Go to the Home Page</a>
      <br>
      <a href="/page/3">Go to page 3</a>
      or
      <fake-link href="/page/3">Soft Load Page 3</fake-link>
    </div>
  `
}

const pageN = (store, actions, params) => {
  const nextPage = parseInt(params.page, 10) + 1
  return html`
    <div>
      <h2>This is Page ${params.page}!</h2>

      <a href="/">Go to the Home Page</a>
      <br>
      <a href="/page/${nextPage}">Go to page ${nextPage}</a>
      or
      <fake-link href="/page/${nextPage}">Soft Load page ${nextPage}</fake-link>
    </div>
  `
}

const nopath = () => {
  return html`
    <div>
      <h2>404!</h2>
    </div>
  `
}

app.addRoute('/', home)
app.addRoute('/page1', page1)
app.addRoute('/page#2', page2)
app.addRoute('/page/:page', pageN)
app.addRoute('/404', nopath)

app.start('.main')
