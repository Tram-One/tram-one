const Tram = require('../../index');
const xtend = require('xtend');

const app = new Tram();

const html = Tram.html({});

const counterReducer = (state, action) => {
  if (action.type === 'click') {
    return xtend(state, { clicks: state.clicks+1 })
  }
  return state;
}

const clicker = (state) => {
  const incrementCount = () => {
    state.dispatch({type: 'click'});
  }
  return html`
    <div onclick=${incrementCount}>
      Tram-One uses minidux to handle state management.
      <br><br>

      This page has been clicked ${state.counter.clicks} times!
    </div>
  `
}

app.addReducer('counter', counterReducer, {clicks: 0});
app.addRoute('/', clicker);
app.start(document.body);
