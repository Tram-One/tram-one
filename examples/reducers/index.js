const Tram = require('../../index');
const app = new Tram();

const html = tram.html({});

const clickReducer = (state, action) {
  if (action.type === 'click') {
    return { count: state.count+1 }
  }
}

const counter = (state) => {
  return html`<div>
    This has been clicked ${count} times!
  </div>`
}

app.route('/', counter);
app.start(document.body);
