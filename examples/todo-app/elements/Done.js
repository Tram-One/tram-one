const Tram = require('../../../tram-one')

const html = Tram.html({})

module.exports = (attrs, children) => {
  return html`
    <div>
      <input type='checkbox' checked disabled />
        <strike> ${attrs.value} </strike>
    </div>
  `
}
