const Tram = require('../../index');
const xtend = require('xtend');
const app = new Tram();

const chrome = require('./chrome');
const colorControl = require('./color-control');
const colorInput = require('./color-input');

const html = Tram.html({
  chrome,
  'color-control': colorControl,
  'color-input': colorInput
});

const colorReducer = (state, action) => {
  if (action.type === 'SELECT_COLOR') {
    return action.color;
  }
  return state;
}

const home = (state) => {
  onSelectColor = (color) => {
    state.dispatch({ type: 'SELECT_COLOR', color: color });
  }

  onEnterColor = (color) => {
    window.location.pathname = color;
  }
  const color = state.color || state.path_color || 'black';
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

app.addReducer('color', colorReducer, undefined)
app.addRoute('/', home);
app.addRoute('/:path_color', home);

app.start('.main');
