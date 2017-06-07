const Tram = require('../../index');

const html = Tram.html({});

module.exports = (attrs, children) => {
  return html`
    <button onclick=${attrs.onAddTodo}>
      Add Todo
    </button>
  `
}
