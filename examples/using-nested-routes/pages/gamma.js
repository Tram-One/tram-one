const Tram = require('../../../tram-one')
const html = Tram.html({
  selection: require('../elements/selection')
})

module.exports = (state, actions, params, children) => {
  const childView = children ? children : html`
    <div>Our child pages can even have their own child pages!</div>
  `

  return html`
    <div>
      <h2>Gamma γ</h2>
      <selection>
        <a href="/gamma/one">one</a>
        <a href="/gamma/two">two</a>
      </selection>
      <div style="background: #FFF">
        ${childView}
      </div>
    </div>
  `
}
