const Tram = require('../../tram-one')
const app = new Tram()

const html = Tram.html({
  chrome: require('./chrome'),
  'color-control': require('./color-control'),
  'color-input': require('./color-input')
})

const home = (state, actions) => {
  const onSelectColor = (color) => {
    actions.selectColor(color)
  }

  const onEnterColor = (color) => {
    window.location.pathname = color
  }
  const color = state.color || state.path.path_color || 'black'
  return html`
    <chrome>
      <div style='color: ${color}'>
        This is an example that uses custom elements, routes, and reducers!
        <br>
        <em>Oh My!</em>
        <br><br>
      </div>
      <color-control onSelectColor=${onSelectColor}>
      </color-control>
      <br>
      <color-input onEnterColor=${onEnterColor}>
      </color-input>
    </chrome>
  `
}

app.addActions({color: {
  init: () => '',
  selectColor: (color, newColor) => newColor
}})
app.addRoute('/', home)
app.addRoute('/:path_color', home)

app.start('.main')
