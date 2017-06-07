const Tram = require('../../index');

const html = Tram.html({});

module.exports = (attrs, children) => {
  return html`
    <div>
      <input type='checkbox' checked />
        <strike> ${attrs.value} </strike>
    </div>
  `
}
