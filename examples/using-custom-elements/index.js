const Tram = require('../../tram-one')
const app = new Tram()

const chrome = require('./chrome')
const html = Tram.html({
  chrome
})

const home = (state) => {
  return html`
    <chrome>
      This is the custom-elements example!
      <br><br>

      Tram-One uses
      <a href="https://github.com/aaaristo/rbel">rbel</a>,
      <a href="https://github.com/shama/bel">bel</a>, and
      <a href="https://github.com/substack/hyperx">hyperx</a>,
      to render tagged and custom elements.
      <br><br>

      Honestly though, special thanks goes out to
      <a href="https://github.com/aaaristo">Andrea Gariboldi</a>
      for building rbel, which does the custom element magic.
      <br><br>

    </chrome>
  `
}

app.addRoute('/', home)
app.start('.main')
