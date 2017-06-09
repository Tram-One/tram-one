const Tram = require('../../index')

const html = Tram.html()

module.exports = (attrs, children) => {
  const style = 'padding: 0em 2em;'
  return html`
    <div>
      <h1>Tram-One 🚋</h1>
      <div style=${style}>
        ${children}
      </div>
    </div>
  `
}
