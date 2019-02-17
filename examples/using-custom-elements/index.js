const Tram = require('../../tram-one')
const app = new Tram()

const chrome = require('./chrome')
const html = Tram.html({
  chrome
})

const home = () => {
  return html`
    <chrome>
      This is the custom-elements example!
      <br />

      Tram-One
      uses <a href="https://github.com/Tram-One/ninlil">ninlil</a> (a fork of rbel), <a href="https://github.com/Tram-One/belit">belit</a> (a fork of nanohtml),
      and <a href="https://github.com/Tram-One/hyperz">hyperz</a> (a fork of hyperx), to render tagged and custom elements.
      <br /><br />

      Honestly though, special thanks goes out
      to <a href="https://github.com/aaaristo">Andrea Gariboldi</a>
      for building rbel, which does the custom element magic.
    </chrome>
  `
}

app.addRoute('/', home)
app.start('.main')
