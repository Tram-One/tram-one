const Tram = require('../../tram-one')
const html = Tram.html()

// this is a similar example of counter-button, but using
// normal attrs, and exposing both a connected, and non-connected
// variant (useful for testing and sharing across projects)

const counterButton = (attrs, children) => {
  const incrementCount = () => {
    console.log(`I've been clicked!`)
    attrs.onclick()
  }

  return html`
    <button onclick=${incrementCount}>
      This button has been clicked ${attrs.counter} times!
    </button>
  `
}

module.exports = (attrs, children) => {
  const {store, actions} = window.engine
  const connectedAttrs = Object.assign({}, attrs, {counter: store.counter, onclick: actions.click})
  return counterButton(connectedAttrs, children)
}

module.exports.counterButton = counterButton
