const Tram = require('../../index');

const html = Tram.html({});

module.exports = (attrs, children) => {
  return html`
    <input onkeyup=${attrs.onUpdateInput}> </input>
  `
}
