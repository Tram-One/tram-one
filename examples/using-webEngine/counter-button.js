const Tram = require('../../tram-one')
const html = Tram.html()

module.exports = (attrs, children) => {
  const {store, actions} = window.engine

  const incrementCount = () => {
    console.log(`I've been clicked!`)
    actions.click()
  }

  return html`
    <button onclick=${incrementCount}>
      This button has been clicked ${store.counter} times!
    </button>
  `
}
