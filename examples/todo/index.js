const Tram = require('../../index');
const app = new Tram();

const html = Tram.html({});

const home = (state) => {
  return html`
    <div>
    </div>
  `
}

const nopath = () => {
  return html`
    <div>
      404!
    </div>
  `
}

app.addRoute('/', home);
app.addRoute('/page1', page1);
app.addRoute('/page#2', page2);
app.addRoute('/:page', pageN);
app.addRoute('/404', nopath);

app.start('.main');
