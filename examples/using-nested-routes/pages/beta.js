const Tram = require('../../../tram-one')
const html = Tram.html()

module.exports = () => html`
  <div>
    <h2>Beta β</h2>
    <div>
      These route-based components have the same
      interface as a top-level page component. That
      is, they take in state, actions, and path parameters!
    </div>
  </div>
`
