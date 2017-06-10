const Tram = require('../../tram-one')

const html = Tram.html()

module.exports = (attrs, children) => {
  return html`
    <div style="font-style: italic;">
      Tram-One Created By Jesse Jurman
    </div>
  `
}
