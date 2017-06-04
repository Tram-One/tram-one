const Tram = require('../../index');
const app = new Tram();

const html = Tram.html({});

const home = (state) => {
  return html`<div>
    This is the routes example!
    <br><br>

    Tram-1 uses
    <a href="https://github.com/yoshuawuyts/nanorouter">nanorouter</a>
    to handle routes.
    <br>
    With nanorouter, Tram-1 supports routes,
    path params, hash routes, and wildcards.
    <br><br>

    Note: in order to use dynamic routes, you'll need a server, or hosting to
    handle client side routing (like <a href="https://surge.sh/">surge.sh</a>)

    <br><br>
    <a href="/page1">Go to Page 1</a>
  </div>`
}

const page1 = (state) => {
  return html`<div>
    This is the First Page!
    <br><br>

    <a href="/">Go to the Home Page</a>
    <br>
    <a href="/page#2">Go to page 2</a>
  </div>`
}

const page2 = (state) => {
  return html`<div>
    This is the Second Page!
    <br><br>

    <a href="/">Go to the Home Page</a>
    <br>
    <a href="/page/3">Go to page 3 (only dynamic routing)</a>
  </div>`
}

const pageN = (state) => {
  return html(`<div>
    This is Page ${state.id}!
    <br><br>

    <a href="/">Go to the Home Page</a>
    <br>
    <a href="/page/${state.id + 1}">Go to page ${state.id + 1}</a>
  </div>`)
}

const nopath = () => {
  return html`<div>
    404!
  </div>`
}

app.addRoute('/', home);
app.addRoute('/page1', page1);
app.addRoute('/page#2', page2);
app.addRoute('/page/:id', pageN);
app.addRoute('/404', nopath);

app.start(document.body);
