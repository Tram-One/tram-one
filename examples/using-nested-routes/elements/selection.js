const Tram = require('../../../tram-one')
const html = Tram.html()

module.exports = (attrs, children) => html`
  <div style="display: flex; justify-content: space-around; padding: 0.5em;">
    ${children}
  </div>
`