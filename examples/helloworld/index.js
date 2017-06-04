const Tram = require('../../index');
const app = new Tram();

const chrome = require('./chrome');
const html = Tram.html({
  chrome
});

const home = (state) => {
  return html`<chrome>
    This is the home page! Welcome!
  </chrome>`
}

const stage = (state) => {
  return html`<chrome>
    This is the stage page!
  </chrome>`
}

const nopath = () => {
  return html`<chrome>
    404!
  </chrome>`
}

app.route('/', home);
app.route('/stage', stage);
app.route('/chrome', chrome);
app.route('/404', nopath);

app.start(document.body);
