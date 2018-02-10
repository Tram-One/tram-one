const Tram = require('../../../tram-one')
const html = Tram.html()

module.exports = (state, actions, params) => html`
  <div>
    <h2>Alpha α</h2>
    <div>
      This means you can have top-level components that
      don't need to be detailed on every new page (like a header and nav)!
    </div>
  </div>
`
